const { WechatyBuilder } = require('wechaty')
const { RECVD_MSG_WEBHOOK } = process.env
const { sendMsg2RecvdWebHook } = require('../service/webhook')
const bot = WechatyBuilder.build() // get a Wechaty instance

module.exports = function init() {
  // 启动 Wechaty 机器人
  bot
    .on('scan', (qrcode, status) => console.log(`Scan QR Code to login: ${status}\nhttps://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`))
    .on('login', async user => {
      console.log(`User ${user} logged in`)
    })
    .on('message', async message => {
      console.log(`Message: ${message}`)

      //收到消息二次转发特殊处理
      if (RECVD_MSG_WEBHOOK && RECVD_MSG_WEBHOOK.startsWith('http')) {
        await sendMsg2RecvdWebHook(message, RECVD_MSG_WEBHOOK)
      }
    })

  bot.start()

  return bot
}
