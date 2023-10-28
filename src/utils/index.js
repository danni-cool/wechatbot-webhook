const { FileBox } = require('file-box')
const MIME = require('mime')
const path = require('path')

const downloadFile = async (fileUrl) => {
  try {
    const response = await fetch(fileUrl)
    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer()
      return {
        type: response.headers.get('content-type'),
        buffer: Buffer.from(arrayBuffer),
      }
    }
    return null
  } catch (error) {
    console.error('Error downloading file:' + fileUrl, error)
    return null
  }
}

const equalTrueType = function (val, expectType) {
  return (
    Object.prototype.toString.call(val).toLowerCase() ===
    `[object ${expectType}]`
  )
}

// http://www.baidu.com/image.png?a=1 => image.png
const getFileNameFromUrl = (url) => url.match(/.*\/([^/?]*)/)?.[1] || ''

// 格式化文件
// 有些资源文件链接是不会返回文件后缀的 例如  https://pangji-home.com/Fi5DimeGHBLQ3KcELn3DolvENjVU  其实是一张图片
const formatUrlToName = (url, mimeType) => {
  const extension = MIME.getExtension(mimeType)
  const baseFileName = getFileNameFromUrl(url)
  return path.extname(url) ? baseFileName : `${baseFileName}.${extension}`
}

// bugfix: use `fileBox.fromUrl` api to get image is OK, but sometimes directly to get cloudflare img may return a 0 bites response.(when response is 301)

const getMediaFromUrl = async (url) => {
  const { buffer, type } = await downloadFile(url)
  return FileBox.fromBuffer(buffer, formatUrlToName(url, type))
}
const getBufferFile = (formDataFile) => {
  return FileBox.fromBuffer(formDataFile.buffer, formDataFile.originalname)
}

// 首字母大写
const capitalizeFirstLetter = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1)

/**
 * @example
 *       const checkList = [
        { key: 'to', val: '', required: true, type: 'string', unValidReason: '' },
      ]
    @return {Array} 返回不通过校验的数组项，并填充上 unValidReason 的原因
 */
const getUnValidParamsList = (arr) => {
  return arr
    .map((item) => {
      // 区分必填和非必填情况，校验非空和类型
      if (item.required) {
        if (item.val === '') {
          item.unValidReason = `${item.key} 不能为空`
        }
        // 文件类型特殊校验
        else if (item.type === 'file' && item.val === 0) {
          item.unValidReason = `${item.key} 上传的文件不能为空`
        }
        // exp: type:[string, object]情况
        else if (equalTrueType(item.type, 'array')) {
          item.unValidReason = item.type.some((type) =>
            equalTrueType(item.val, type),
          )
            ? ''
            : `${item.key} 的参数类型不是 ${item.type
                .map((key) => capitalizeFirstLetter(key))
                .join(' or ')}`
        } else if (item.type !== 'file' && typeof item.val !== item.type) {
          item.unValidReason = `${
            item.key
          } 的参数类型不是 ${capitalizeFirstLetter(item.type)}`
        }
      } else {
        item.unValidReason =
          typeof item.val !== item.type
            ? `${item.key} 的参数类型不是 ${capitalizeFirstLetter(item.type)}`
            : ''
      }

      // 前者通过，如果遇到要校验指定枚举值的情况
      if (item.unValidReason === '' && item.enum && item.enum.length > 0) {
        item.unValidReason = !item.enum.includes(item.val)
          ? `${item.key} 必须是 ${item.enum.join(' or ')}`
          : ''
      }

      return item
    })
    .filter(({ unValidReason }) => unValidReason)
}

const generateToken = (num = 12) => {
  const charset =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.~'
  let token = ''
  for (let i = 0; i < num; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    token += charset[randomIndex]
  }

  return token
}

module.exports = {
  getFileNameFromUrl,
  getMediaFromUrl,
  getBufferFile,
  getUnValidParamsList,
  generateToken,
  equalTrueType,
}
