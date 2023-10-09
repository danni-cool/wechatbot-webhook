const { sendMsg2RecvdApi } = require('../service/webhook')
const { TextMsg } = require('../utils/msg')

// 登录
module.exports = function registerLoginCheck({ app, bot }) {
  let message,
    logOutWhenError = false,
    success = false

  bot
    .on('scan', qrcode => {
      message = 'https://wechaty.js.org/qrcode/' + encodeURIComponent(qrcode)
      success = false
    })
    .on('login', user => {
      message = user + 'is already login'
      success = true
      logOutWhenError = false
      sendMsg2RecvdApi(new TextMsg({
        text: JSON.stringify({ event: 'login', user }),
        isSystemEvent: true
      }))
    })
    .on('logout', user => {
      message = ''
      success = false
      // 登出时给接收消息api发送特殊文本
      sendMsg2RecvdApi(new TextMsg({
        text: JSON.stringify({ event: 'logout', user }),
        isSystemEvent: true
      }))
    })
    .on('error', error => {
      // 报错时接收特殊文本
      sendMsg2RecvdApi(new TextMsg({
        text: JSON.stringify({ event: 'error', error }),
        isSystemEvent: true
      }))

      // 处理异常错误后的登出上报，每次登录成功后掉线只上报一次
      if (!logOutWhenError && !bot.isLoggedIn) {
        logOutWhenError = true
        success = false
        message = ''
        sendMsg2RecvdApi(new TextMsg({
          text: JSON.stringify({ event: 'logout', user }),
          isSystemEvent: true
        }))
      }
    })

  // 处理 POST 请求
  app.get('/loginCheck', async (req, res) => {

    // getLoginApiToken
    const { token } = req.query

    if (token !== process.env.globalLoginToken) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Access is denied due to invalid credentials.'
      });
    }

    try {
      res.status(200).json({
        success,
        message
      })

    } catch (error) {
      console.error('Error handling POST request:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  });
} 