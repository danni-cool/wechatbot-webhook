const { FileBox } = require('file-box')
const MIME = require('mime')
const { logger } = require('./log')
const { URL } = require('url')

/**
 * 转化base64为buffer, 并尝试获取文件类型content-type
 * @param {string} base64
 * @returns {Promise<{buffer?: Buffer, fileName?: string}>}
 */
const base64ToBuffer = async (base64) => {
  let mimeType = null

  /***
   * 提取并解析 MIME 类型（如果存在）
   * @param {string} base64
   */
  const getMimeTypeFromUri = (base64) => {
    const matches = base64.match(/^data:(.*?);base64,/)
    if (matches) {
      return matches[1]
    }
    return null
  }

  // 检查是否包含 Data URI scheme
  mimeType = getMimeTypeFromUri(base64)

  // 如果没有 Data URI scheme，处理纯 Base64 字符串
  const base64StringWithoutPrefix = base64.replace(/^data:.*?;base64,/, '')
  const buffer = Buffer.from(base64StringWithoutPrefix, 'base64')
  // commonjs require esm module
  const { fileTypeFromBuffer } = await import('file-type')

  if (!mimeType) {
    const fileType = await fileTypeFromBuffer(buffer)
    mimeType = fileType ? fileType.mime : 'unknown'
  }

  const extName = MIME.getExtension(mimeType)

  return {
    buffer,
    fileName: `${Date.now()}.${extName}`
  }
}

/**
 * 下载媒体文件转化为Buffer
 * @param {string} fileUrl
 * @param {*} headers
 * @returns {Promise<{buffer?: Buffer, fileName?: string, contentType?: null | string}>}
 */
const downloadFile = async (fileUrl, headers = {}) => {
  try {
    const response = await fetch(fileUrl, { headers })

    if (response.ok) {
      const buffer = Buffer.from(await response.arrayBuffer())
      // 使用自定义文件名，解决URL无文件后缀名时，文件被微信解析成不正确的后缀问题
      let { fileName } = getFileInfoFromUrl(fileUrl)
      let contentType = response.headers.get('content-type')

      // deal with unValid Url format like https://pangji-home.com/Fi5DimeGHBLQ3KcELn3DolvENjVU
      if (fileName === '') {
        // 有些资源文件链接是不会返回文件后缀的 例如  https://pangji-home.com/Fi5DimeGHBLQ3KcELn3DolvENjVU  其实是一张图片
        //@ts-expect-errors 不考虑无content-type的情况
        const extName = MIME.getExtension(contentType)
        fileName = `${Date.now()}.${extName}`
      }

      return {
        buffer,
        fileName,
        contentType
      }
    }

    return {}
  } catch (error) {
    logger.error('Error downloading file:' + fileUrl, error)
    return {}
  }
}

/**
 * @typedef {{fileName: string, query: null | Record<string, string>} } fileInfoObj
 * 从url中提取文件名
 * @param {string} url
 * @returns {fileInfoObj}
 * @example 参数 url 示例
 * valid: "http://www.baidu.com/image.png?a=1 => image.png"
 * notValid: "https://pangji-home.com/Fi5DimeGHBLQ3KcELn3DolvENjVU => ''"
 */
const getFileInfoFromUrl = (url) => {
  /** @type {fileInfoObj} */
  let matchRes = {
    fileName: url.match(/.*\/([^/?]*)/)?.[1] || '', // fileName has string.string is Valid filename
    query: null
  }

  try {
    const urlObj = new URL(url)
    matchRes.query = Object.fromEntries(urlObj.searchParams)
  } catch (e) {
    // make ts happy
  }

  return matchRes
}

/**
 * 根据url下载文件并转化成FileBox的标准格式
 * @param {string} url
 * @param {string} fileNameAlias
 * @returns {Promise<import('file-box').FileBoxInterface>}
 */
const getMediaFromUrl = async (url, fileNameAlias) => {
  const { buffer, fileName } = await downloadFile(url)
  //@ts-expect-errors buffer 解析是吧的情况
  return FileBox.fromBuffer(buffer, fileNameAlias || fileName)
}

/**
 * 传入base64 返回文件 buffer
 * @param {*} base64Str
 * @param {*} fileNameAlias
 * @returns
 */
const getMediaFromBase64 = async (base64Str, fileNameAlias) => {
  const { buffer, fileName } = await base64ToBuffer(base64Str)

  //@ts-expect-errors buffer 解析是吧的情况
  return FileBox.fromBuffer(buffer, fileNameAlias || fileName)
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
  ...require('./res'),
  downloadFile,
  getMediaFromBase64,
  getMediaFromUrl,
  getBufferFile,
  generateToken,
  parseJsonLikeStr,
  tryConvertCnCharToUtf8Char,
  sleep,
  Defer
}
