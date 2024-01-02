const { MSG_TYPE_ENUM } = require('../config/const')
class CommonMsg {
  /**
   * @param {string} text
   * @param {import("@src/config/const").MSG_TYPE_ENUM} type
   * @param {boolean} [isSystemEvent]
   */
  constructor(text, type, isSystemEvent = false) {
    this.t = type
    this.payload = text
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
   * @param {Object} option
   * @param {string} option.text
   * @param {boolean} option.isSystemEvent
   */
  constructor({ text, isSystemEvent = false }) {
    super(text, MSG_TYPE_ENUM.TEXT, isSystemEvent)
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

module.exports = {
  CommonMsg,
  TextMsg,
  FriendshipMsg
}
