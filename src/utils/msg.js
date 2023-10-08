module.exports.TextMsg = class TextMsg {
  constructor({ text, isSystemEvent = false }) {
    this.payload  = text
    this.isSystemEvent = isSystemEvent
  }

  type() {
    return 7
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