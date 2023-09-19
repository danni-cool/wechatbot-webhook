// 此处批量管理注册的webhook
const registerRoomHook = require('./RoomMsg')

module.exports = function registerWebHook({app, bot}) {
  registerRoomHook({app, bot})
} 