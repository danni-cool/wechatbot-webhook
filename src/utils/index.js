const { FileBox } = require('file-box') // bugfix: wechaty can not export FileBox, but wechaty is rely on file-box package

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
      imgArr.length === 1 ?
        await msgInstance.say(FileBox.fromUrl(imgArr[0])) :
        // 多张图的情况
        await (async () => {
          for (let i = 0; i < imgArr.length; i++) {
            await msgInstance.say(FileBox.fromUrl(imgArr[i]))
          }
        })()

      return true
  }
}

module.exports = {
  formatAndSendMsg
}

