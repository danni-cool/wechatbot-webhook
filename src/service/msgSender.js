const Utils = require('../utils/index.js')
const { sendMsg2RecvdApi } = require('./msgUploader.js')
const { MSG_TYPE_ENUM } = require('../config/const.js')
const rules = require('../config/valid.js')

/**
 * 根据传入规则校验消息发送单元 type 和 content 是否合法
 * @param {pushMsgUnitPayload} param
 */
const getPushMsgUnitUnvalidStr = function ({ type, content }) {
  return Utils.getUnValidParamsList(
    rules.pushMsgV2ChildRules({
      type,
      content
    })
  )
    .map(({ unValidReason }) => unValidReason)
    .join('，')
}

/**
 * 发送消息核心。这个处理程序将数据转换为标准格式，然后使用 wechaty 发送消息。
 * @type {{
 * (payload:{ type: 'text' | 'fileUrl'|'file', content: string| payloadFormFile, msgInstance: msgInstanceType }) : Promise<boolean>;
 * }}
 */
const formatAndSendMsg = async function ({ type, content, msgInstance }) {
  let flag = false

  try {
    switch (type) {
      // 纯文本
      case 'text':
        //@ts-expect-errors 重载不是很好使，手动判断
        await msgInstance.say(content)
        break

      case 'fileUrl': {
        //@ts-expect-errors 重载不是很好使，手动判断
        const fileUrlArr = content.split(',')
        // 单文件
        if (fileUrlArr.length === 1) {
          //@ts-expect-errors 重载不是很好使，手动判断
          const file = await Utils.getMediaFromUrl(content)
          await msgInstance.say(file)
          break
        }

        // 多个文件的情况
        for (let i = 0; i < fileUrlArr.length; i++) {
          const file = await Utils.getMediaFromUrl(fileUrlArr[i])
          await msgInstance.say(file)
        }
        break
      }
      // 文件
      case 'file':
        {
          //@ts-expect-errors 重载不是很好使，手动判断
          await msgInstance.say(await Utils.getBufferFile(content))
        }
        break
      default:
        throw new Error('发送消息 type 不能为空')
    }
    flag = true
  } catch (e) {
    Utils.logger.error(e)
  }

  return flag
}

/**
 * 接受 Service.sendMsg2RecvdApi 的response 回调以便回复或作出其他动作
 * @param {Object} payload
 * @param {Response} [payload.res]
 * @param {import('@src/config/const.js').MSG_TYPE_ENUM} payload.type
 * @param {import('wechaty').Friendship} [payload.friendship]
 * @param {msgInstanceType} [payload.msgInstance]
 */
const handleResSendMsg = async ({ res, type, friendship, msgInstance }) => {
  let success, data

  if (res?.ok) {
    const result = await res.json()

    if (!result) return

    success = result.success
    data = result.data
  }

  switch (type) {
    case MSG_TYPE_ENUM.CUSTOM_FRIENDSHIP:
      success === true
        ? //@ts-expect-errors 重载不是很好使，手动判断
          await friendship.accept()
        : Utils.logger.info(
            //@ts-expect-errors 重载不是很好使，手动判断
            `not auto accepted, because ${friendship
              .contact()
              //@ts-expect-errors 重载不是很好使，手动判断
              .name()}'s verify message is: ${friendship.hello()}`
          )

      // 同意且包含回复信息
      if (success === true && data !== undefined) {
        await Utils.sleep(1000)
        //@ts-expect-errors 重载不是很好使，手动判断
        msgSendQueueHandler(data, friendship.contact())
      }

      break

    default:
      if (success === true && data !== undefined) {
        await Utils.sleep(1000)
        msgSendQueueHandler(data, msgInstance)
      }
      break
  }
}

/**
 * 收消息钩子
 * @param {import('wechaty').Message} msg
 */
const onRecvdMessage = async (msg) => {
  // 自己发的消息没有必要处理
  if (msg.self()) return

  handleResSendMsg({
    res: await sendMsg2RecvdApi(msg),
    type: msg.type(),
    msgInstance: msg
  })
}

/**
 *
 * @param {*} data
 * @param {*} msgInstance
 */
const msgSendQueueHandler = (data, msgInstance) => {
  if (Array.isArray(data)) {
    data.forEach((item) => {
      Utils.nextTick(() => {
        formatAndSendMsg({
          type: item.type,
          content: item.content,
          msgInstance
        })
      })
    })
  } else {
    Utils.nextTick(() => {
      formatAndSendMsg({
        type: data.type,
        content: data.content,
        msgInstance
      })
    })
  }
}

module.exports = {
  formatAndSendMsg,
  handleResSendMsg,
  onRecvdMessage,
  msgSendQueueHandler,
  getPushMsgUnitUnvalidStr
}
