const { streamSSE } = require('hono/streaming')

/**
 * 注册login路由和处理上报逻辑
 * @param {Object} param
 * @param {import('hono').Hono} param.app
 * @param {import('wechaty').Wechaty} param.bot
 */

module.exports = function registerLoginCheck({ app, bot }) {
  let message = ''
  let success = false

  bot
    .on('scan', (qrcode) => {
      message = qrcode
      success = false
    })
    .on('login', async (user) => {
      message = user + 'is already login'
      success = true
    })
    .on('logout', () => {
      message = ''
      success = false
    })
    .on('error', async () => {
      if (!bot.isLoggedIn) {
        success = false
        message = ''
      }
    })

  app.get(
    '/login',
    /** @param {import('hono').Context} c */
    async (c) => {
      // 登录成功的话，返回登录信息
      if (success) {
        return c.json({
          success,
          message
        })
      } else {
        // 构建带有iframe的HTML字符串
        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>扫码登录</title>
          <script src="/static/qrcode.min.js"></script>
          <style>
            body, html { 
              margin: 0; padding: 0; height: 100%; overflow: hidden; 
            }
          </style>
        </head>
        <body>
          <div id="qrcode"></div>
          <script>
            var qrcode = new QRCode(document.getElementById("qrcode"), {
              width : 300,
              height : 300
            });
            qrcode.makeCode("${message}");

            const eventSource = new EventSource("/sse");
            eventSource.addEventListener ("qrcode", (event) => {
              qrcode.makeCode(event.data);
            })

            eventSource.addEventListener ("login", (event) => {
              eventSource.close()
              window.location.reload()
            })
          </script>
        </body>
        </html>
      `
        return c.html(html)
      }
    }
  )

  app.get('/sse', async (c) => {
    return streamSSE(c, async (stream) => {
      while (true) {
        await stream.writeSSE({
          event: !success ? 'qrcode' : 'login',
          data: message
        })
        await stream.sleep(1000)
      }
    })
  })

  app.get(
    '/healthz',
    /** @param {import('hono').Context} c */
    async (c) => {
      // 登录成功的话，返回登录信息
      if (success) {
        return c.text('healthy')
      } else {
        return c.text('unHealthy')
      }
    }
  )
}
