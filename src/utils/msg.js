const { MSG_TYPE_ENUM } = require('../config/const')
class CommonMsg {
  constructor(text, type, isSystemEvent = false) {
    this.t = type
    this.payload = text
    this.isSystemEvent = isSystemEvent
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
  constructor({ text, isSystemEvent = false }) {
    super(text, MSG_TYPE_ENUM.TEXT, isSystemEvent)
  }
}

class FriendshipMsg extends CommonMsg {
  constructor(payload) {
    super(JSON.stringify(payload), MSG_TYPE_ENUM.CUSTOM_FRIENDSHIP)
  }
}

module.exports = {
  TextMsg,
  FriendshipMsg,
}
