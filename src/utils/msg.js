const { MSG_TYPE_ENUM, legacySystemMsgStrMap } = require('../config/const')
class CommonMsg {
  /**
   * @param {string} text
   * @param {import("@src/config/const").MSG_TYPE_ENUM} type
   * @param {boolean} [isSystemEvent]
   */
  constructor(text, type, isSystemEvent = false) {
    this.t = type
    this.payload = text
    /** @deprecated 已经废弃，但保留其旧版本逻辑的兼容性 */
    this.isSystemEvent = isSystemEvent
  }

  toUrlLink() {
    return {
      payload: ''
    }
  }

  mentionSelf() {
    return false
  }

  type() {
    return this.t
  }

  text() {
    return this.payload
  }

  self() {
    return false
  }

  room() {
    return ''
  }

  to() {
    return ''
  }

  talker() {
    return ''
  }
}

class TextMsg extends CommonMsg {
  /**
   * @param {string} text
   */
  constructor(text) {
    super(text, MSG_TYPE_ENUM.TEXT)
  }
}

class FriendshipMsg extends CommonMsg {
  /**
   * @param {Record<string,any>} payload
   */
  constructor(payload) {
    super(JSON.stringify(payload), MSG_TYPE_ENUM.CUSTOM_FRIENDSHIP)
  }
}

class SystemEvent extends CommonMsg {
  /**
   * @param {systemEventPayload} payload
   */
  constructor(payload) {
    super(JSON.stringify(payload), legacySystemMsgStrMap[payload.event], true)
  }
}

module.exports = {
  CommonMsg,
  TextMsg,
  FriendshipMsg,
  SystemEvent
}
