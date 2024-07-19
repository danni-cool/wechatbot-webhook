const {
  config: { localUrl }
} = require('../config/const')

/**
 * 将相对资源路径转为代理获取资源路径
 * @param {string} relativePath
 * @returns {string}
 */
module.exports.getAssetsAgentUrl = (relativePath) => {
  if (!relativePath) return ''

  return `${localUrl}/resouces?media=${encodeURIComponent(relativePath)}`
}
