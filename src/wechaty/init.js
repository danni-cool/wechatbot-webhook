const { version } = require('../../package.json')
const { WechatyBuilder } = require('wechaty')
const { SystemEvent } = require('../utils/msg.js')
const Service = require('../service')
const Utils = require('../utils/index')
const chalk = require('chalk')
const { PORT } = process.env
const { memoryCardName, logOutUnofficialCodeList } = require('../config/const')
const token = Service.initLoginApiToken()
const cacheTool = require('../service/cache')
const bot =
  process.env.DISABLE_AUTO_LOGIN === 'true'
    ? WechatyBuilder.build()
    : WechatyBuilder.build({
        name: memoryCardName
      })

module.exports = function init() {
  /** @type {import('wechaty').Contact} */
  let currentUser
  let botLoginSuccessLastTime = false

  console.log(chalk.blue(`🤖 wechatbot-webhook v${version} 🤖`))

  // 启动 Wechaty 机器人
  bot
    // 扫码登陆事件
    .on('scan', (qrcode) => {
      Utils.logger.info('✨ 扫描以下二维码以登录 ✨')
      require('qrcode-terminal').generate(qrcode, { small: true })
      Utils.logger.info(
        [
          'Or Access the URL to login: ' +
            chalk.cyan(`http://localhost:${PORT}/login?token=${token}`)
        ].join('\n')
      )
    })

    // 登陆成功事件
    .on('login', async (user) => {
      Utils.logger.info('🌱 ' + chalk.green(`User ${user} logged in`))
      Utils.logger.info(
        '💬 ' +
          `你的推消息 api 为：${chalk.cyan(
            `http://localhost:${PORT}/webhook/msg/v2?token=${token}`
          )}`
      )
      Utils.logger.info(
        '📖 发送消息结构 API 请参考: ' +
          `${chalk.cyan(
            'https://github.com/danni-cool/wechatbot-webhook?tab=readme-ov-file#%EF%B8%8F-api'
          )}\n`
      )

      currentUser = user
      botLoginSuccessLastTime = true

      Service.sendMsg2RecvdApi(new SystemEvent({ event: 'login', user })).catch(
        (e) => {
          Utils.logger.error('上报login事件给 RECVD_MSG_API 出错', e)
        }
      )
    })

    // 登出事件
    .on('logout', async (user) => {
      /** bugfix: 重置登录会触发多次logout，但是上报只需要登录成功后登出那一次 */
      if (!botLoginSuccessLastTime) return

      botLoginSuccessLastTime = false

      Utils.logger.info(chalk.red(`User ${user.toString()} logout`))

      // 登出时给接收消息api发送特殊文本
      Service.sendMsg2RecvdApi(
        new SystemEvent({ event: 'logout', user })
      ).catch((e) => {
        Utils.logger.error('上报 logout 事件给 RECVD_MSG_API 出错：', e)
      })
    })

    .on('room-topic', async (room, topic, oldTopic, changer) => {
      Utils.logger.info(
        `Room ${await room.topic()} topic changed from ${oldTopic} to ${topic} by ${changer.name()}`
      )
    })

    // 群加入
    .on('room-join', async (room, inviteeList, inviter) => {
      Utils.logger.info(
        `Room ${await room.topic()} ${inviter} invited ${inviteeList} to join this room`
      )
      cacheTool.get('room', room.id) && cacheTool.del('room', room.id)
    })

    // 有人离开群（ If someone leaves the room by themselves, wechat will not notice other people in the room,）
    .on('room-leave', async (room, leaver) => {
      Utils.logger.info(
        `Room ${await room.topic()} ${leaver} leaved from this room`
      )
      cacheTool.get('room', room.id) && cacheTool.del('room', room.id)
    })

    // 收到消息事件
    .on('message', async (message) => {
      Utils.logger.info(`Message: ${message.toString()}`)
      Service.onRecvdMessage(message).catch((e) => {
        Utils.logger.error('向 RECVD_MSG_API 上报 message 事件出错：', e)
      })
    })

    // 收到加好友请求事件
    .on('friendship', async (friendship) => {
      await Service.onRecvdFriendship(friendship, bot)
    })

    // 各种出错事件
    .on('error', async (error) => {
      Utils.logger.error(`\n${chalk.red(error)}\n`)

      if (!bot.isLoggedIn) return

      // wechaty 未知的登出状态，处理异常错误后的登出上报
      if (
        logOutUnofficialCodeList.some((item) => error.message.includes(item))
      ) {
        await bot.logout()
      }

      // 发送error事件给接收消息api
      Service.sendMsg2RecvdApi(
        new SystemEvent({ event: 'error', error, user: currentUser })
      ).catch((e) => {
        Utils.logger.error('上报 error 事件给 RECVD_MSG_API 出错：', e)
      })
    })

  bot.start().catch((e) => {
    Utils.logger.error('bot 初始化失败：', e)
  })

  return bot
}
