const { WechatyBuilder } = require('wechaty')

// 创建 Wechaty 机器人
const bot = WechatyBuilder.build() // get a Wechaty instance


module.exports = function init ()  {
  // 启动 Wechaty 机器人
  bot
    .on('scan', (qrcode, status) => console.log(`Scan QR Code to login: ${status}\nhttps://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`))
    .on('login', async user => {
      console.log(`User ${user} logged in`)
    })
    .on('message', message => console.log(`Message: ${message}`))

  bot.start()

  return bot
}
