/**
 * 使用此功能调用 wechaty 发消息
 */
const chalk = require('chalk')
const { MSG_TYPE_ENUM } = require('../config/const.js')
const Utils = require('../utils/index.js')
const { sendMsg2RecvdApi } = require('./msgUploader.js')

/**
 * 发送消息核心。这个处理程序将数据转换为标准格式，然后使用 wechaty 发送消息。
 * @type {{
 * (payload:{
 *  isRoom?: boolean,bot:import('wechaty/impls').WechatyInterface,
 *  msgInstance: msgInstanceType,
 *  msgData: msgData
 * }) : Promise<{success:boolean, error:any}>;
 * }}
 */
module.exports.formatAndSendMsg = async function ({
  isRoom = false,
  bot,
  msgData: { type = 'text', fileAlias, content },
  msgInstance
}) {
  let success = false
  let error
  /** @type {msgStructurePayload} */
  const emitPayload = {
    content: '',
    type: {
      text: MSG_TYPE_ENUM.TEXT,
      fileUrl: MSG_TYPE_ENUM.ATTACHMENT,
      file: MSG_TYPE_ENUM.ATTACHMENT,
      base64: MSG_TYPE_ENUM.ATTACHMENT
    }[type],
    type_display: {
      text: '消息',
      fileUrl: '文件',
      file: '文件',
      base64: '文件'
    }[type],
    self: true,
    from: bot.currentUser,
    to: msgInstance,
    // @ts-ignore 此处一定是 roomInstance
    room: isRoom ? msgInstance : ''
  }

  try {
    switch (type) {
      // 纯文本
      case 'text':
        //@ts-expect-errors 重载不是很好使，手动判断
        await msgInstance.say(content)
        //@ts-expect-errors 重载不是很好使，手动判断
        emitPayload.content = content
        msgSenderCallback(emitPayload)
        break

      case 'base64': {
        const file = await Utils.getMediaFromBase64(content, fileAlias)
        //@ts-expect-errors 重载不是很好使，手动判断
        emitPayload.content = file
        await msgInstance.say(file)
        msgSenderCallback(emitPayload)
        break
      }

      case 'fileUrl': {
        //@ts-expect-errors 重载不是很好使，手动判断
        const file = await Utils.getMediaFromUrl(content, fileAlias)
        //@ts-expect-errors 重载不是很好使，手动判断
        emitPayload.content = file
        await msgInstance.say(file)
        msgSenderCallback(emitPayload)
        break
      }

      // 文件
      case 'file':
        {
          //@ts-expect-errors 重载不是很好使，手动判断
          const file = await Utils.getBufferFile(content)
          await msgInstance.say(file)
          //@ts-expect-errors 重载不是很好使，手动判断
          emitPayload.content = file
          msgSenderCallback(emitPayload)
        }
        break

      default:
        throw new Error('发送消息 type 不能为空')
    }
    success = true
  } catch (/** @type {any} */ e) {
    error = e
    Utils.logger.error(e)
  }

  return { success, error }
}

/** 推消息api发送后
 * @param {msgStructurePayload} payload
 */
const msgSenderCallback = async (payload) => {
  Utils.logger.info(
    `调用 bot api 发送 ${payload.type_display} 给 ${chalk.blue(payload.to)}:`,
    typeof payload.content === 'object'
      ? payload.content._name ?? 'unknown file'
      : payload.content
  )

  if (process.env.ACCEPT_RECVD_MSG_MYSELF !== 'true') return
  sendMsg2RecvdApi(new Utils.ApiMsg(payload))
}
