const { FileBox } = require('file-box')
const MIME = require('mime')
const { logger } = require('./log')
/**
 * 下载媒体文件转化为Buffer
 * @param {string} fileUrl
 * @returns {Promise<{buffer?: Buffer, fileName?: string}>}
 */
const downloadFile = async (fileUrl) => {
  try {
    const response = await fetch(fileUrl)

    if (response.ok) {
      const buffer = Buffer.from(await response.arrayBuffer())
      let fileName = getFileNameFromUrl(fileUrl)

      // deal with unValid Url format like https://pangji-home.com/Fi5DimeGHBLQ3KcELn3DolvENjVU
      if (fileName === '') {
        // 有些资源文件链接是不会返回文件后缀的 例如  https://pangji-home.com/Fi5DimeGHBLQ3KcELn3DolvENjVU  其实是一张图片
        //@ts-expect-errors 不考虑无content-type的情况
        const extName = MIME.getExtension(response.headers.get('content-type'))
        fileName = `${Date.now()}.${extName}`
      }

      return {
        buffer,
        fileName
      }
    }

    return {}
  } catch (error) {
    logger.error('Error downloading file:' + fileUrl, error)
    return {}
  }
}

/**
 * 从url中提取文件名
 * @param {string} url
 * @returns {string}
 * @example 参数 url 示例
 * valid: "http://www.baidu.com/image.png?a=1 => image.png"
 * notValid: "https://pangji-home.com/Fi5DimeGHBLQ3KcELn3DolvENjVU => ''"
 */
const getFileNameFromUrl = (url) => {
  const matchRes = url.match(/.*\/([^/?]*)/)?.[1]

  if (matchRes === undefined) return ''

  const checkMathDotPosition = matchRes.indexOf('.')
  // fileName has string.string is Valid filename
  if (checkMathDotPosition > -1) {
    return matchRes
  } else {
    return ''
  }
}

/**
 * 根据url下载文件并转化成FileBox的标准格式
 * @param {string} url
 * @returns {Promise<import('file-box').FileBoxInterface>}
 */
const getMediaFromUrl = async (url) => {
  const { buffer, fileName } = await downloadFile(url)
  //@ts-expect-errors buffer 解析是吧的情况
  return FileBox.fromBuffer(buffer, fileName)
}

/**
 * @typedef {payloadFormFile} formDataFileInterface
 * @param {formDataFileInterface} formDataFile
 * @returns
 */
const getBufferFile = async (formDataFile) => {
  const arrayBuffer = await formDataFile.arrayBuffer()
  return FileBox.fromBuffer(
    Buffer.from(arrayBuffer),
    formDataFile.convertName ?? formDataFile.name
  )
}

/**
 *
 * @param {number} num
 * @returns {string} token
 */
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

/**
 * @param {string} jsonLikeStr
 * @returns {string}
 * @example jsonLikeStr 示例结构
 * `{"alias":123,'alias2':  '123', alias3: 123}` => `{"alias":123,"alias2":"123", "asf":2}`
 */
const parseJsonLikeStr = (jsonLikeStr) => {
  const formatStr = jsonLikeStr
    .replace(/'?(\w+)'?\s*:/g, '"$1":')
    .replace(/:\s*'([^']+)'/g, ':"$1"')

  return JSON.parse(formatStr)
}

/**
 * 检测每个字符是否都可以被iso-8859-1表示,因为curl http1.1 在发送form-data时，文件名是中文的话会被编码成 iso-8859-1表示
 * @param {string} str
 * @returns {string}
 * @see https://github.com/danni-cool/wechatbot-webhook/issues/71
 */
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

/**
 * 创建并返回一个具有额外 resolve 和 reject 方法的 Promise 对象。
 * @returns {Promise<any> & { resolve: (value: any) => void, reject: (reason?: any) => void }}
 */
function Defer() {
  /**@type {(value: any) => void} */
  let res
  /**@type {(reason?: any) => void} */
  let rej

  /** @type {Promise<any> & { resolve: (value: any) => void, reject: (reason?: any) => void }} */
  // @ts-expect-errors 没法完美定义类型，暂时忽略
  const promise = new Promise((resolve, reject) => {
    res = resolve
    rej = reject
  })

  // @ts-expect-errors 没法完美定义类型，暂时忽略
  promise.resolve = res
  // @ts-expect-errors 没法完美定义类型，暂时忽略
  promise.reject = rej

  return promise
}

/**
 * @param {number} ms
 */
const sleep = async (ms) => {
  return await new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * 删除登录缓存文件
 */
// const deleteMemoryCard = () => {
//   //@ts-expect-errors 必定是 pathlike
//   if (fs.existsSync(memoryCardPath)) {
//     //@ts-expect-errors 必定是 pathlike
//     fs.unlinkSync(memoryCardPath)
//   }
// }

module.exports = {
  ...require('./msg.js'),
  ...require('./nextTick.js'),
  ...require('./paramsValid.js'),
  ...require('./log.js'),
  getFileNameFromUrl,
  getMediaFromUrl,
  getBufferFile,
  generateToken,
  parseJsonLikeStr,
  tryConvertCnCharToUtf8Char,
  sleep,
  Defer
}
