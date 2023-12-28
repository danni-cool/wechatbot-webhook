// 此处批量管理注册的webhook
const registerMsgPusherRouter = require('./msgSender')
const registerLoginCheck = require('./login')

module.exports = function registerRoute({ app, bot }) {
  registerMsgPusherRouter({ app, bot })
  registerLoginCheck({ app, bot })
}
