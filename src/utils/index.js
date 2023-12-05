const { FileBox } = require('file-box')
const MIME = require('mime')

const downloadFile = async (fileUrl) => {
  try {
    const response = await fetch(fileUrl)

    if (response.ok) {
      const buffer = Buffer.from(await response.arrayBuffer())
      let fileName = getFileNameFromUrl(fileUrl)

      // deal with unValid Url format like https://pangji-home.com/Fi5DimeGHBLQ3KcELn3DolvENjVU
      if (!fileName) {
        // 有些资源文件链接是不会返回文件后缀的 例如  https://pangji-home.com/Fi5DimeGHBLQ3KcELn3DolvENjVU  其实是一张图片
        const extName = MIME.getExtension(response.headers.get('content-type'))
        fileName = `${Date.now()}.${extName}`
      }

      return {
        buffer,
        fileName,
      }
    }

    return {}
  } catch (error) {
    console.error('Error downloading file:' + fileUrl, error)
    return {}
  }
}

const equalTrueType = function (val, expectType) {
  return (
    Object.prototype.toString.call(val).toLowerCase() ===
    `[object ${expectType}]`
  )
}

// valid: http://www.baidu.com/image.png?a=1 => image.png
// notValid: https://pangji-home.com/Fi5DimeGHBLQ3KcELn3DolvENjVU => ''
const getFileNameFromUrl = (url) => {
  const matchRes = url.match(/.*\/([^/?]*)/)?.[1]
  const checkMathDotPosition = matchRes.indexOf('.')
  // fileName has string.string is Valid filename
  if (~checkMathDotPosition && checkMathDotPosition > 0) {
    return matchRes
  } else {
    return ''
  }
}

// bugfix: use `fileBox.fromUrl` api to get image is OK, but sometimes directly to get cloudflare img may return a 0 bites response.(when response is 301)
const getMediaFromUrl = async (url) => {
  const { buffer, fileName } = await downloadFile(url)
  return FileBox.fromBuffer(buffer, fileName)
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

// `{"alias":123,'alias2':   '123', alias3: 123}` => `{"alias":123,"alias2":"123", "asf":2}`
const parseJsonLikeStr = (jsonLikeStr) => {
  const formatStr = jsonLikeStr
    .replace(/'?(\w+)'?\s*:/g, '"$1":')
    .replace(/:\s*'([^']+)'/g, ':"$1"')

  return JSON.parse(formatStr)
}

// 检测每个字符是否都可以被iso-8859-1表示,因为curl http1.1 在发送form-data时，文件名是中文的话会被编码成 iso-8859-1表示
// https://github.com/danni-cool/docker-wechatbot-webhook/issues/71
function tryConvertCnCharToUtf8Char(str) {
  const isIso88591 = [...str].every((char) => {
    const codePoint = char.charCodeAt(0)
    return codePoint >= 0x00 && codePoint <= 0xff
  })

  if (isIso88591) {
    // 假设原始编码是 ISO-8859-1，将每个字符转换为相应的字节
    const bytes = new Uint8Array(str.length)
    for (let i = 0; i < str.length; i++) {
      bytes[i] = str.charCodeAt(i)
    }

    // 使用 TextDecoder 将 ISO-8859-1 编码的字节解码为 UTF-8 字符串
    const decoder = new TextDecoder('UTF-8')
    return decoder.decode(bytes)
  }

  return str
}

module.exports = {
  getFileNameFromUrl,
  getMediaFromUrl,
  getBufferFile,
  getUnValidParamsList,
  generateToken,
  equalTrueType,
  parseJsonLikeStr,
  tryConvertCnCharToUtf8Char,
}
