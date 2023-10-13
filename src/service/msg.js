const Utils = require('../utils/index.js')
const chalk = require("chalk")

// this handler convert data to a standard format before using wechaty to send msg, 
const formatAndSendMsg = async function ({ bot, type, content, msgInstance }) {
  // const { UrlLink } =  bot

  switch (type) {
    // 纯文本
    case 'text':
      await msgInstance.say(content);
      return true

    case 'fileUrl':
      const fileUrlArr = content.split(',')
      // 单文件
      if (fileUrlArr.length === 1) {
        const file = await Utils.getMediaFromUrl(content)
        await msgInstance.say(file)
        return true
      }

      // 多个文件的情况
      for (let i = 0; i < fileUrlArr.length; i++) {
        let file = await Utils.getMediaFromUrl(fileUrlArr[i])
        await msgInstance.say(file)
      }
      return true
  
    // 文件
    case 'file':
      await msgInstance.say(Utils.getBufferFile(content))
      return true
  }
}

module.exports = {
  formatAndSendMsg,
}
