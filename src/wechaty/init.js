const { WechatyBuilder } = require('wechaty')
const { sendMsg2RecvdAPI, getValidRecvdApi } = require('../service/webhook')
const bot = WechatyBuilder.build() // get a Wechaty instance
const chalk = require('chalk')

module.exports = function init() {
  const webhookUrl = getValidRecvdApi() 

  // 启动 Wechaty 机器人
  bot
    .on('scan', (qrcode) => console.log(`\n以下链接浏览器打开wx扫码登录: ${chalk.cyan('https://wechaty.js.org/qrcode/' + encodeURIComponent(qrcode))}`))
    .on('login', async user => {
      console.log(`User ${user} logged in`)
    })
    // .on('room-topic', async (room, topic, oldTopic, changer) => {
    //   console.log(`Room ${await room.topic()} topic changed from ${oldTopic} to ${topic} by ${changer.name()}`)
    // })
    .on('message', async message => {
      console.log(`Message: ${message}`)
      //收到消息二次转发特殊处理
      webhookUrl && await sendMsg2RecvdAPI(message, webhookUrl)

    })
    .on('error', (error) => {
      console.error(`\n${chalk.red(error)}\n`)
    })

  bot.start()

  return bot
}
