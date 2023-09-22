const Utils = require('../utils/index.js')

// this handler convert data to a standard format before using wechaty to send msg, 
const formatAndSendMsg = async function ({ type, content, msgInstance }) {
  switch (type) {
    // 纯文本
    case 'text':
      await msgInstance.say(content);
      return true

    // 图片
    case 'img':
      // 逗号分割的多张图的情况
      const imgArr = content.split(',')
      // 只有一张图
      if (imgArr.length === 1) {
        await msgInstance.say(await Utils.getMediaFromUrl(content))
        return true
      }

      // 多张图的情况
      for (let i = 0; i < imgArr.length; i++) {
        await msgInstance.say(await Utils.getMediaFromUrl(imgArr[i]))
      }
      return true
  }
}

module.exports = {
  formatAndSendMsg,
}
