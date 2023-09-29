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
const getFileNameFromUrl = url => url.match(/.*\/([^/?]*)/)?.[1] || ''

// bugfix: use `fileBox.fromUrl` api to get image is OK, but sometimes directly to get cloudflare img may return a 0 bites response.(when response is 301)
const getMediaFromUrl = async url =>
  FileBox.fromBuffer(await downloadImage(url), getFileNameFromUrl(url))

/**
 * @example
 *       const checkList = [
        { key: 'to', val: '', required: true, type: 'string', unValidReason: '' },
      ]
    @return {Array} 返回不通过校验的数组项，并填充上 unValidReason 的原因
 */
const getUnvalidParamsList = arr => {
  return arr
    .map(item => {

      // 区分必填和非必填情况，校验非空和类型
      if (item.required) {
        if (item.val === '') {
          item.unValidReason = `${item.key} 不能为空`
        }
        else if (typeof item.val !== item.type) {
          item.unValidReason = `${item.key} 的参数类型不是 ${item.type}`
        }
      } else {
        item.unValidReason = typeof item.val !== item.type ? `${item.key} 的参数类型不是 ${item.type}` : ''
      }

      //前者通过，如果遇到要校验指定枚举值的情况
      if(item.unValidReason === '' && (item.enum && item.enum.length >0)) {
        item.unValidReason = !item.enum.includes(item.val) ? `${item.key} 必须是 ${item.enum.join(' or ')}`  : ''
      }

      return item
    })
    .filter(({ unValidReason }) => unValidReason)
}

module.exports = {
  getFileNameFromUrl,
  getMediaFromUrl,
  getUnvalidParamsList
}

