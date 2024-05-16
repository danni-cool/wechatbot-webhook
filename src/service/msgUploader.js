const Utils = require('../utils/index')
const fetch = require('node-fetch-commonjs')
const { config, systemMsgEnumMap } = require('../config/const')
const FormData = require('form-data')
const { LOCAL_RECVD_MSG_API, RECVD_MSG_API } = process.env
const { MSG_TYPE_ENUM } = require('../config/const')
const cacheTool = require('../service/cache')
const cloneDeep = require('lodash.clonedeep')
/**
 * 收到消息上报接受url
 * @typedef {{type:'text'|'fileUrl'}} baseMsgInterface
 * @param {extendedMsg} msg
 * @returns {Promise<undefined|Response>} recvdApiReponse
 */
async function sendMsg2RecvdApi(msg) {
  // 检测是否配置了webhookurl
  let webhookUrl
  /**
   * @param {string} key
   * @param {string|undefined} value
   */
  const errorText = (key, value) => {
    Utils.logger.error(
      `配置参数 ${key}: ${value} <- 不符合 URL 规范, 该 API 将不会收到请求\n`
    )
  }

  // 外部传入了以外部为准
  if (!['', undefined].includes(RECVD_MSG_API)) {
    webhookUrl = ('' + RECVD_MSG_API).startsWith('http') ? RECVD_MSG_API : ''
    webhookUrl === '' && errorText('RECVD_MSG_API', RECVD_MSG_API)
    // 无外部则用本地
  } else if (!['', undefined].includes(LOCAL_RECVD_MSG_API)) {
    webhookUrl = ('' + LOCAL_RECVD_MSG_API).startsWith('http')
      ? LOCAL_RECVD_MSG_API
      : ''
    webhookUrl === '' && errorText('LOCAL_RECVD_MSG_API', LOCAL_RECVD_MSG_API)
  }

  // 有webhookurl才发送
  if (!webhookUrl) return
  /** @type {roomInfoForUpload} */
  //@ts-expect-errors 强制as配合 ts-expect-errors 实用更佳
  const roomInfo = msg.room()

  if (typeof roomInfo !== 'string' && typeof roomInfo !== 'undefined') {
    /**@type {import('wechaty/impls').ContactInterface[] & {_expired?: Number}} */
    let roomMemberInfo = cacheTool.get('room', roomInfo.id)

    if (!roomMemberInfo) {
      roomMemberInfo = await roomInfo.memberAll()

      // 频繁获取群成员信息会导致该接口被封，群成员无变化时信息缓存5分钟（仅限上报api）
      // 过期是因为群成员自己离开是无通知的
      cacheTool.set('room', {
        id: roomInfo.id,
        value: roomMemberInfo,
        expired: config.roomCachedTime
      })
    }
    roomInfo.payload.memberList = roomMemberInfo.map((item) => ({
      // @ts-expect-error wechaty定义问题，数据在payload里
      avatar: Utils.getAssetsAgentUrl(item.payload.avatar),
      // @ts-expect-error wechaty定义问题，数据在payload里
      id: item.payload.id,
      // @ts-expect-error wechaty定义问题，数据在payload里
      name: item.payload.name,
      // @ts-expect-error wechaty定义问题，数据在payload里
      alias: item.payload.alias
    }))
    // we have memberList already
    if (roomInfo.payload && 'memberIdList' in roomInfo.payload) {
      //@ts-expect-errors 这里每次返回的都是新对象
      delete roomInfo.payload.memberIdList
    }
  }

  const source = {
    room: cloneDeep(roomInfo || {}),
    /** @type { import('wechaty').Message['to'] } */
    // @ts-ignore
    to: cloneDeep(msg.to() || {}),
    from: cloneDeep(msg.talker() || {})
  }

  // @ts-ignore
  if (source.to && source.to.payload?.avatar) {
    // @ts-ignore
    source.to.payload.avatar = Utils.getAssetsAgentUrl(source.to.payload.avatar)
  }

  // @ts-ignore
  if (source.from.payload?.avatar) {
    // @ts-ignore
    source.from.payload.avatar = Utils.getAssetsAgentUrl(
      // @ts-ignore
      source.from.payload.avatar
    )
  }

  if (source.room.payload?.avatar) {
    source.room.payload.avatar = Utils.getAssetsAgentUrl(
      source.room.payload.avatar
    )
  }

  // let passed = true
  /** @type {import('form-data')} */
  const formData = new FormData()

  formData.append('source', JSON.stringify(source))
  //@ts-expect-errors 自己加的私有属性
  formData.append('isSystemEvent', msg.isSystemEvent === true ? '1' : '0')

  // 有人@我
  const someoneMentionMe =
    msg.mentionSelf &&
    (await msg.mentionSelf()) /** 原版@我，wechaty web版应该都是false */
  formData.append('isMentioned', someoneMentionMe ? '1' : '0')

  // 判断是否是自己发送的消息
  formData.append('isMsgFromSelf', msg.self() ? '1' : '0')

  switch (msg.type()) {
    case MSG_TYPE_ENUM.ATTACHMENT: {
      // hack, 如果附件类型消息
      try {
        dealWithFileMsg(formData, msg)
      } catch (e) {
        /** 已知场景转发会进入这个逻辑，但好像还是没法显示转发内容，当unknown处理 */
        formData.append('type', 'unknown')
        formData.append('content', msg.text()) /** 当前不支持该消息展示 */
      }
      break
    }
    case MSG_TYPE_ENUM.VOICE:
    case MSG_TYPE_ENUM.PIC:
    case MSG_TYPE_ENUM.VIDEO: {
      dealWithFileMsg(formData, msg)
      break
    }
    // 分享的Url
    case MSG_TYPE_ENUM.MEDIA_URL: {
      const { payload } = await msg.toUrlLink()
      formData.append('type', 'urlLink')
      formData.append('content', JSON.stringify(payload))
      break
    }

    // 纯文本
    case MSG_TYPE_ENUM.TEXT:
      formData.append('type', 'text')
      formData.append('content', msg.text())
      break

    // 好友邀请消息(自定义消息type)
    case MSG_TYPE_ENUM.CUSTOM_FRIENDSHIP:
      formData.append('type', 'friendship')
      formData.append('content', msg.text())
      break

    // 系统消息（用于上报状态）
    case MSG_TYPE_ENUM.SYSTEM_EVENT_LOGIN:
    case MSG_TYPE_ENUM.SYSTEM_EVENT_LOGOUT:
    case MSG_TYPE_ENUM.SYSTEM_EVENT_PUSH_NOTIFY:
    case MSG_TYPE_ENUM.SYSTEM_EVENT_ERROR:
      formData.append('type', systemMsgEnumMap[msg.type()])
      formData.append('content', msg.text())
      break

    // 其他统一当unknown处理
    case MSG_TYPE_ENUM.UNKNOWN:
    case MSG_TYPE_ENUM.EMOTION: // 自定义表情
    default:
      formData.append('type', 'unknown')
      formData.append('content', msg.text())
      break
  }

  // if (!passed) return

  Utils.logger.info('starting fetching api: ' + webhookUrl)
  //@ts-expect-errors form-data 未定义的私有属性
  Utils.logger.debug('fetching payload:', formData._streams)
  /**@type {Response} */
  let response

  try {
    //@ts-expect-error node-fetch-commonjs 无type
    response = await fetch(webhookUrl, {
      method: 'POST',
      body: formData
    })

    if (!response?.ok) {
      Utils.logger.error(
        `HTTP error When trying to send Data to RecvdApi: ${response?.status}`
      )
    }
  } catch (e) {
    Utils.logger.error('Error occurred when trying to send Data to RecvdApi', e)
  }

  //@ts-expect-errors 提前使用没问题
  return response
}

/**
 * 抽离附件上传公共逻辑
 * @param {import('form-data')} formData
 * @param {extendedMsg} msg
 */
async function dealWithFileMsg(formData, msg) {
  /**@type {import('file-box').FileBox} */
  //@ts-expect-errors 这里msg一定是wechaty的msg
  const steamFile = msg.toFileBox ? await msg.toFileBox() : msg.content()
  // 上面尝试转化文件报错就不会进入以下逻辑
  formData.append('type', 'file')

  let fileInfo = {
    // @ts-ignore
    ext: steamFile._name.split('.').pop() ?? '',
    // @ts-ignore
    mime: steamFile._mediaType ?? 'Unknown',
    // @ts-ignore
    filename: steamFile._name ?? 'UnknownFile'
  }

  formData.append(
    'content',
    //@ts-expect-errors 需要用到私有属性
    steamFile.buffer /** 发送一个文件 */ ??
      //@ts-expect-errors 需要用到私有属性
      steamFile.stream /** 同一个文件转发 */,
    {
      filename: fileInfo.filename,
      contentType: fileInfo.mime
    }
  )
}

module.exports = {
  sendMsg2RecvdApi
}
