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
    case 'img': /* @deprecated in next majorVersion*/
      // 逗号分割的多个文件Url的情况

      if(type === 'img') {
        console.log(`\n⚠️ ${ chalk.yellow(" Waring: 请求中参数 type: 'img' 在下个版本将不受支持，请更换为 type: 'fileUrl'，具体可以参考：")}⚠️\n`)
      }

      const fileUrlArr = content.split(',')
      // 只有一张图
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
