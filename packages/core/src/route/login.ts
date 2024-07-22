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
      message = 'https://wechaty.js.org/qrcode/' + encodeURIComponent(qrcode)
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
          <style>
            body, html { 
              margin: 0; padding: 0; height: 100%; overflow: hidden; 
            }
            iframe { 
              position:absolute; left:0; right:0; bottom:0; top:0; border:0; 
            }
          </style>
        </head>
        <body>
          <iframe src="${message}" frameborder="0" style="height:100%;width:100%" allowfullscreen></iframe>
        </body>
        </html>
      `
        return c.html(html)
      }
    }
  )

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
