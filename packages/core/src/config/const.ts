const path = require('path')
// const { PORT } = process.env

const config = {
  /**
   * 上报消息的api群成员缓存多久(单位:ms)
   * @type {number}
   */
  roomCachedTime: 1000 * 60 * 5,
  /** 服务启动地址 */
  localUrl: `http://localhost:${PORT}`
}

const { homeEnvCfg, homeMemoryCardPath } = process.env
const isCliEnv = Boolean(homeEnvCfg)
const memoryCardName = isCliEnv ? homeMemoryCardPath : 'loginSession'
const memoryCardPath = isCliEnv
  ? homeMemoryCardPath
  : path.join(__dirname, '../../', 'loginSession.memory-card.json')

/**
 * Enum for msg type
 * @readonly
 * @enum {number} */
const MSG_TYPE_ENUM = {
  /** 未知 */
  UNKNOWN: 0,
  /** 各种文件 */
  ATTACHMENT: 1,
  /** 语音 */
  VOICE: 2,
  /** 表情包 */
  EMOTION: 5,
  /** 图片 */
  PIC: 6,
  /** 文本 */
  TEXT: 7,
  /** 公众号链接 */
  MEDIA_URL: 14,
  /** 视频 */
  VIDEO: 15,
  /** 好友邀请 or 好友通过消息（自定义类型） */
  CUSTOM_FRIENDSHIP: 99,
  /** 系统消息类型 */
  /** 登录事件 */
  SYSTEM_EVENT_LOGIN: 1000,
  /** 登出事件 */
  SYSTEM_EVENT_LOGOUT: 1001,
  /** 错误事件 */
  SYSTEM_EVENT_ERROR: 1002,
  /** 推送通知事件 */
  SYSTEM_EVENT_PUSH_NOTIFY: 1003
}

/**
 * Enum for system msg type (legacy)
 * @readonly
 * @enum {number} */
const legacySystemMsgStrMap = {
  login: MSG_TYPE_ENUM.SYSTEM_EVENT_LOGIN,
  logout: MSG_TYPE_ENUM.SYSTEM_EVENT_LOGOUT,
  error: MSG_TYPE_ENUM.SYSTEM_EVENT_ERROR,
  notifyOfRecvdApiPushMsg: MSG_TYPE_ENUM.SYSTEM_EVENT_PUSH_NOTIFY
}

/**
 * 系统消息类型映射表(外部)
 * @enum {string} */
const systemMsgEnumMap = {
  [MSG_TYPE_ENUM.SYSTEM_EVENT_LOGIN]: 'system_event_login',
  [MSG_TYPE_ENUM.SYSTEM_EVENT_LOGOUT]: 'system_event_logout',
  [MSG_TYPE_ENUM.SYSTEM_EVENT_ERROR]: 'system_event_error',
  [MSG_TYPE_ENUM.SYSTEM_EVENT_PUSH_NOTIFY]: 'system_event_push_notify'
}

const logOutUnofficialCodeList = [
  '400 != 400',
  '1101 == 0',
  "'1101' == 0",
  '1205 == 0',
  '3 == 0',
  "'1102' == 0" /** 场景：没法发消息了 */,
  '-1 == 0' /** 场景：没法发消息 */,
  "'-1' == 0" /** 不确定，暂时两种都加上 */
]

module.exports = {
  MSG_TYPE_ENUM,
  config,
  legacySystemMsgStrMap,
  systemMsgEnumMap,
  memoryCardName,
  memoryCardPath,
  logOutUnofficialCodeList
}
