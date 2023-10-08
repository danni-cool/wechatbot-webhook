const { WechatyBuilder } = require('wechaty')
const { sendMsg2RecvdApi, getLoginApiToken } = require('../service/webhook')
const bot = WechatyBuilder.build() // get a Wechaty instance
const chalk = require('chalk')
const { PORT } = process.env

module.exports = function init() {
  // 启动 Wechaty 机器人
  bot
    .on('scan', (qrcode) =>
      console.log([
        `\nAccess the URL to login: ${chalk.cyan('https://wechaty.js.org/qrcode/' + encodeURIComponent(qrcode))}`,
        'You can also check login by API: ' + chalk.cyan(`http://localhost:${PORT}/loginCheck?token=${getLoginApiToken()}`)
      ].join('\n')))
    .on('login', async user => console.log(chalk.green(`User ${user} logged in`)))
    .on('logout', async user => console.log(chalk.red(`User ${user} logout`)))
    // .on('room-topic', async (room, topic, oldTopic, changer) => {
    //   console.log(`Room ${await room.topic()} topic changed from ${oldTopic} to ${topic} by ${changer.name()}`)
    // })
    .on('message', async message => {
      console.log(`Message: ${message}`)
      //收到消息二次转发特殊处理
      sendMsg2RecvdApi(message)

    })
    .on('error', (error) => {
      console.error(`\n${chalk.red(error)}\n`)
    })

  bot.start()

  return bot
}
