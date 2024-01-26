const Service = require('../service')
const Utils = require('../utils')
const Middleware = require('../middleware')
const { SystemEvent } = require('../utils/msg.js')

/**
 * 注册login路由和处理上报逻辑
 * @param {Object} param
 * @param {import('hono').Hono} param.app
 * @param {import('wechaty').Wechaty} param.bot
 */
module.exports = function registerLoginCheck({ app, bot }) {
  let message = ''
  /** @type {import('wechaty').ContactSelf | null} */
  let currentUser = null
  let logOutWhenError = false
  let success = false

  bot
    .on('scan', (qrcode) => {
      message = 'https://wechaty.js.org/qrcode/' + encodeURIComponent(qrcode)
      success = false
    })
    .on('login', async (user) => {
      message = user.toString() + 'is already login'
      success = true
      currentUser = user
      logOutWhenError = false

      try {
        await Service.sendMsg2RecvdApi(
          new SystemEvent({ event: 'login', user })
        )
      } catch (e) {
        Utils.logger.error('上报login事件给 RECVD_MSG_API 出错', e)
      }
    })
    .on('logout', (user) => {
      message = ''
      currentUser = null
      success = false
      // 登出时给接收消息api发送特殊文本
      Service.sendMsg2RecvdApi(
        new SystemEvent({ event: 'logout', user })
      ).catch((e) => {
        Utils.logger.error('上报 logout 事件给 RECVD_MSG_API 出错：', e)
      })
    })
    .on('error', (error) => {
      // 登出后的错误没有必要重复上报
      !logOutWhenError &&
        Service.sendMsg2RecvdApi(
          new SystemEvent({ event: 'error', error, user: currentUser })
        ).catch((e) => {
          Utils.logger.error('上报 error 事件给 RECVD_MSG_API 出错：', e)
        })

      // 处理异常错误后的登出上报，每次登录成功后掉线只上报一次
      if (!logOutWhenError && !bot.isLoggedIn) {
        Service.sendMsg2RecvdApi(
          new SystemEvent({ event: 'logout', user: currentUser })
        ).catch((e) => {
          Utils.logger.error(
            '上报 error 事件中的 logout 给 RECVD_MSG_API 出错：',
            e
          )
        })

        success = false
        message = ''
        logOutWhenError = true
        currentUser = null
      }
    })

  app.get(
    '/login',
    Middleware.verifyToken,

    /** @param {import('hono').Context} c */
    async (c) => {
      // 登录成功的话，返回登录信息
      if (success) {
        return c.json({
          success,
          message
        })
      } else {
        return c.redirect(message, 302)
      }
    }
  )

  app.get(
    '/healthz',
    Middleware.verifyToken,
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
