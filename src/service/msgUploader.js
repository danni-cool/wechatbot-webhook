const Utils = require('../utils/index')
const fetch = require('node-fetch-commonjs')
const { config } = require('../config/const')
const FormData = require('form-data')
const { LOCAL_RECVD_MSG_API, RECVD_MSG_API } = process.env
const { MSG_TYPE_ENUM } = require('../config/const')
const cacheTool = require('../service/cache')

/**
 * 收到消息上报接受url
 * @typedef {{type:'text'|'fileUrl'}} baseMsgInterface
 * @param {extendedMsg} msg
 * @returns {Promise<undefined|Response>} recvdApiReponse
 */
async function sendMsg2RecvdApi(msg) {
  // 自己发的消息没有必要转发（外部已经处理）
  // if (msg.self()) return
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
  /** @type {import('wechaty/impls').RoomInterface & {payload: { memberList: {id:string,name:string,alias:string|undefined}[]}}} */
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
    /** room的话解析群成员信息，原始信息不会带 */
    room: roomInfo ?? '',
    to: msg.to() ?? '',
    from: msg.talker() ?? ''
  }

  let passed = true
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

  switch (msg.type()) {
    case MSG_TYPE_ENUM.ATTACHMENT:
    case MSG_TYPE_ENUM.VOICE:
    case MSG_TYPE_ENUM.PIC:
    case MSG_TYPE_ENUM.VIDEO: {
      // 视频
      formData.append('type', 'file')
      /**@type {import('file-box').FileBox} */
      //@ts-expect-errors 这里msg一定是wechaty的msg
      const steamFile = await msg.toFileBox()

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
    // 其他统一暂不处理
    case MSG_TYPE_ENUM.EMOTION: // 自定义表情
    default:
      passed = false
      break
  }

  if (!passed) return

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

module.exports = {
  sendMsg2RecvdApi
}
