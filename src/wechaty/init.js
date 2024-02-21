const { version } = require('../../package.json')
const { WechatyBuilder } = require('wechaty')
const Service = require('../service')
const Utils = require('../utils/index')
const chalk = require('chalk')
const { PORT, homeEnvCfg, homeMemoryCardPath } = process.env
const isCliEnv = Boolean(homeEnvCfg)
const token = Service.initLoginApiToken()
const cacheTool = require('../service/cache')
const bot =
  process.env.DISABLE_AUTO_LOGIN === 'true'
    ? WechatyBuilder.build()
    : WechatyBuilder.build({
        name: isCliEnv ? homeMemoryCardPath : 'loginSession'
      })

module.exports = function init() {
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
      if (process.env.homeEnvCfg !== undefined) {
        Utils.logger.info(
          [
            '🌱 ' + chalk.green(`User ${user.toString()} logged in`),
            '📖 发送消息 HTTP API 请参考: ' +
              `${chalk.cyan(
                'https://github.com/danni-cool/wechatbot-webhook?tab=readme-ov-file#%EF%B8%8F-api'
              )}`
          ].join('\n')
        )
        return
      }

      Utils.logger.info(`🌱 User ${user.toString()} logged in`)
    })

    // 登出事件
    .on('logout', async (user) => {
      Utils.logger.info(chalk.red(`User ${user.toString()} logout`))
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
    .on('error', (error) => {
      Utils.logger.error(`\n${chalk.red(error)}\n`)
    })

  bot.start().catch((e) => {
    Utils.logger.error('bot 初始化失败：', e)
  })

  return bot
}
