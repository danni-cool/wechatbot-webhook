const Service = require('../service')
const Middleware = require('../middleware')
const { TextMsg } = require('../utils/msg')

// 登录
module.exports = function registerLoginCheck({ app, bot }) {
  let message,
    lastLoginUser = null,
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
      lastLoginUser = user
      logOutWhenError = false
      Service.sendMsg2RecvdApi(new TextMsg({
        text: JSON.stringify({ event: 'login', user }),
        isSystemEvent: true
      }))
    })
    .on('logout', user => {
      message = ''
      success = false
      // 登出时给接收消息api发送特殊文本
      Service.sendMsg2RecvdApi(new TextMsg({
        text: JSON.stringify({ event: 'logout', user }),
        isSystemEvent: true
      }))
    })
    .on('error', error => {
      // 报错时接收特殊文本
      Service.sendMsg2RecvdApi(new TextMsg({
        text: JSON.stringify({ event: 'error', error, user: lastLoginUser }),
        isSystemEvent: true
      }))

      // 处理异常错误后的登出上报，每次登录成功后掉线只上报一次
      if (!logOutWhenError && !bot.isLoggedIn) {
        Service.sendMsg2RecvdApi(new TextMsg({
          text: JSON.stringify({ event: 'logout', user: lastLoginUser }),
          isSystemEvent: true
        }))
        success = false
        message = ''
        logOutWhenError = true
        lastLoginUser = null
      }
    })

  app.get('/login', Middleware.verifyToken, Service.handleError(async (req, res) => {
    // 登录成功的话，返回登录信息
    if (success) {
      res.status(200).json({
        success,
        message
      })
    } else {
      res.redirect(301, message);
    }

  }));


  app.get('/loginCheck', Middleware.verifyToken, Service.handleError(async (req, res) => {
    res.status(200).json({
      success,
      message
    })
  }));
} 