/** 只想纯console.log输出，但是不记录到日志文件的白名单 */
const logOnlyOutputWhiteList = [
  '▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄\n' //扫二维码登录
]

/** 不想输出的一些错误信息 */
const logDontOutpuptBlackList = [
  '[https://github.com/node-fetch/node-fetch/issues/1167]' // form-data 提示的DepracationWarning，会被认为是错误提issue
]

module.exports = {
  logOnlyOutputWhiteList,
  logDontOutpuptBlackList
}
