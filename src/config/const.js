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
  CUSTOM_FRIENDSHIP: 99
}

const config = {
  /**
   * 上报消息的api群成员缓存多久(单位:ms)
   * @type {number}
   */
  roomCachedTime: 1000 * 60 * 5
}

module.exports = { MSG_TYPE_ENUM, config }
