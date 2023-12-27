const Utils = require('../utils/index.js')
const { MSG_TYPE_ENUM } = require('../config/const.js')
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
 *
 */
const handleResSendMsg = async ({
  res,
  type,
  contact,
  isRoom,
  friendship = null,
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
            `not auto accepted, because ${contact.name()}'s verify message is: ${friendship.hello()}`,
          )

      // 同意且包含回复信息
      if (data) {
        await new Promise((r) => setTimeout(r, 1000))
        await friendship.contact().say(message)
      }

      break
  }
}

module.exports = {
  formatAndSendMsg,
  handleResSendMsg,
}
