// 此处批量管理注册的webhook
const registerMsgPusherRouter = require('./msg')

module.exports = function registerRoute({app, bot}) {
  registerMsgPusherRouter({app, bot})
} 