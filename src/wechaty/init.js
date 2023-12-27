const { WechatyBuilder } = require('wechaty')
const Service = require('../service')
const chalk = require('chalk')
const { PORT, homeEnvCfg, homeMemoryCardPath } = process.env
const isCliEnv = !!homeEnvCfg
const bot =
  process.env.DISABLE_AUTO_LOGIN === 'true'
    ? WechatyBuilder.build()
    : WechatyBuilder.build({
        name: isCliEnv ? homeMemoryCardPath : 'loginSession',
      })

module.exports = function init() {
  // 启动 Wechaty 机器人
  bot
    // 扫码登陆事件
    .on('scan', (qrcode) => {
      console.log('✨ 扫描以下二维码以登录 ✨')
      require('qrcode-terminal').generate(qrcode, { small: true })

      console.log(
        [
          'Or Access the URL to login: ' +
            chalk.cyan(
              `http://localhost:${PORT}/login?token=${Service.getLoginApiToken()}`,
            ),
        ].join('\n'),
      )
    })

    // 登陆成功事件
    .on('login', async (user) => {
      if (process.env.homeEnvCfg) {
        console.log(
          [
            '🌱 ' + chalk.green(`User ${user} logged in`),
            '📖 发送消息 HTTP API 请参考: ' +
              `${chalk.cyan(
                'https://github.com/danni-cool/wechatbot-webhook?tab=readme-ov-file#%EF%B8%8F-api',
              )}`,
          ].join('\n'),
        )
        return
      }

      console.log(chalk.green(`User ${user} logged in`))
    })

    // 登出事件
    .on('logout', async (user) => console.log(chalk.red(`User ${user} logout`)))

    // 群聊名更换事件（有点问题）
    // .on('room-topic', async (room, topic, oldTopic, changer) => {
    //   console.log(`Room ${await room.topic()} topic changed from ${oldTopic} to ${topic} by ${changer.name()}`)
    // })

    // 收到消息事件
    .on('message', async (message) => {
      console.log(`Message: ${message}`)
      // 收到消息二次转发特殊处理
      Service.sendMsg2RecvdApi(message)
    })

    // 收到加好友请求事件
    .on('friendship', async (friendship) =>
      Service.onRecvdFriendship(friendship, bot),
    )

    // 各种出错事件
    .on('error', (error) => {
      console.error(`\n${chalk.red(error)}\n`)
    })

  bot.start()

  return bot
}
