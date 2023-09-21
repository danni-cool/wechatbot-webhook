const { FileBox } = require('file-box') // bugfix: wechaty can not export FileBox until v1.20.2 , so use the dependency of wechaty 
const fetch = require('node-fetch-commonjs')

const downloadImage = async imageUrl => {
  try {
    const response = await fetch(imageUrl);
    if (response.ok) {
      return await response.buffer();
    }
    return null;
  } catch (error) {
    console.error('Error downloading image:' + imageUrl, error);
    return null;
  }
}

//http://www.baidu.com/image.png?a=1 => image.png
const getFileNameFromUrl = (url) => url.match(/.*\/([^/?]*)/)?.[1] || ''

// bugfix: use `fileBox.fromUrl` api to get image is OK, but sometimes directly to get cloudflare img may return a 0 bites response.(when response is 301)
const getMediaFromUrl = async url =>
  FileBox.fromBuffer(await downloadImage(url), getFileNameFromUrl(url))

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
        await msgInstance.say(await getMediaFromUrl(content))
        return true
      }

      // 多张图的情况
      for (let i = 0; i < imgArr.length; i++) {
        await msgInstance.say(await getMediaFromUrl(imgArr[i]))
      }
      return true
  }
}

module.exports = {
  formatAndSendMsg
}

