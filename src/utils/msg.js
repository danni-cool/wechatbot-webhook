const { MSG_TYPE_ENUM, legacySystemMsgStrMap } = require('../config/const')
const { getAssetsAgentUrl } = require('./res')
const cloneDeep = require('lodash.cloneDeep')
class CommonMsg {
  /**
   * @param {commonMsgPayload} payload
   */
  constructor({
    text,
    type,
    isSystemEvent = false,
    self = false,
    room = '',
    to,
    from = '',
    file = ''
  }) {
    this.t = type
    this.isSelf = self
    this.toInfo = to
    this.fromInfo = from
    this.fileInfo = file
    this.roomInfo = room
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
    return this.isSelf
  }

  room() {
    return this.roomInfo
  }

  content() {
    return this.fileInfo
  }

  to() {
    return this.toInfo
  }

  talker() {
    return this.fromInfo
  }
}

class ApiMsg extends CommonMsg {
  /** @param {msgStructurePayload } payload*/
  constructor({ from, to, room = '', content = '', type, self = false }) {
    if (type === MSG_TYPE_ENUM.TEXT) {
      super({
        from,
        to,
        room,
        // @ts-expect-error 此处一定是string
        text: content,
        type,
        self
      })
    } else {
      super({ from, to, room, type, file: content, self })
    }
  }
}

class TextMsg extends CommonMsg {
  /**
   * @param {string} text
   */
  constructor(text) {
    super({ text, type: MSG_TYPE_ENUM.TEXT })
  }
}

class FriendshipMsg extends CommonMsg {
  /**
   * @param {Record<string,any>} payload
   */
  constructor(payload) {
    super({
      text: JSON.stringify(payload),
      type: MSG_TYPE_ENUM.CUSTOM_FRIENDSHIP
    })
  }
}

class SystemEvent extends CommonMsg {
  /**
   * @param {systemEventPayload} payload
   */
  constructor(payload) {
    const payloadClone = cloneDeep(payload)
    if (payloadClone.user?.payload) {
      payloadClone.user.payload.avatar = getAssetsAgentUrl(
        payloadClone.user.payload.avatar
      )
    }

    super({
      text: JSON.stringify(payloadClone),
      type: legacySystemMsgStrMap[payload.event],
      isSystemEvent: true
    })
  }
}

module.exports = {
  CommonMsg,
  ApiMsg,
  TextMsg,
  FriendshipMsg,
  SystemEvent
}
