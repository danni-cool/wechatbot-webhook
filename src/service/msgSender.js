const Utils = require('../utils/index.js')
const Service = require('./index.js')
const { MSG_TYPE_ENUM } = require('../config/const.js')

// 发送消息核心
// this handler convert data to a standard format before using wechaty to send msg,
const formatAndSendMsg = async function ({ type, content, msgInstance }) {
  switch (type) {
    // 纯文本
    case 'text':
      await msgInstance.say(content)
      return true

    case 'fileUrl': {
      const fileUrlArr = content.split(',')
      // 单文件
      if (fileUrlArr.length === 1) {
        const file = await Utils.getMediaFromUrl(content)
        await msgInstance.say(file)
        return true
      }

      // 多个文件的情况
      for (let i = 0; i < fileUrlArr.length; i++) {
        const file = await Utils.getMediaFromUrl(fileUrlArr[i])
        await msgInstance.say(file)
      }
      return true
    }
    // 文件
    case 'file':
      await msgInstance.say(Utils.getBufferFile(content))
      return true
  }
}

/**
 * 接受 Service.sendMsg2RecvdApi 的response 回调以便回复或作出其他动作
 */
const handleResSendMsg = async ({
  res,
  type,
  friendship = null,
  msgInstance = null,
}) => {
  let success, data

  if (res && res.ok) {
    const result = await res.json()
    success = result.success
    data = result.data
  }

  switch (type) {
    case MSG_TYPE_ENUM.CUSTOM_FRIENDSHIP:
      success
        ? await friendship.accept()
        : console.log(
            `not auto accepted, because ${friendship
              .contact()
              .name()}'s verify message is: ${friendship.hello()}`,
          )

      // 同意且包含回复信息
      if (success && data) {
        await new Promise((r) => setTimeout(r, 1000))
        msgSendQueueHandler(data, friendship.contact())
      }

      break

    default:
      if (success && data) {
        await new Promise((r) => setTimeout(r, 1000))
        msgSendQueueHandler(data, msgInstance)
      }
      break
  }
}

// 收消息钩子
const onRecvdMessage = async (msg) => {
  // 自己发的消息没有必要处理
  if (msg.self()) return

  handleResSendMsg({
    res: await Service.sendMsg2RecvdApi(msg),
    type: msg.type(),
    msgInstance: msg,
  })
}

// 消息处理队列
const msgSendQueueHandler = (data, msgInstance) => {
  if (Array.isArray(data)) {
    data.forEach((item) => {
      Utils.nextTick(() => {
        formatAndSendMsg({
          type: item.type,
          content: item.content,
          msgInstance,
        })
      })
    })
  } else {
    Utils.nextTick(() => {
      formatAndSendMsg({
        type: data.type,
        content: data.content,
        msgInstance,
      })
    })
  }
}

module.exports = {
  formatAndSendMsg,
  handleResSendMsg,
  onRecvdMessage,
}
