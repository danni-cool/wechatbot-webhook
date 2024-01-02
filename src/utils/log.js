if (!process.env.homeEnvCfg) {
  const log4js = require('log4js')

  // 配置日志
  log4js.configure({
    appenders: {
      out: {
        type: 'stdout',
        layout: {
          type: 'pattern',
          pattern: '%[[%d] [%p] - %m %]'
        }
      },
      file: {
        type: 'dateFile',
        filename: 'log/app.log',
        pattern: 'yyyy-MM-dd',
        level: 'trace',
        alwaysIncludePattern: true,
        keepFileExt: true,
        layout: {
          type: 'pattern',
          pattern: '[%d] [%p] - %m'
        }
      },
      logFilter: {
        type: 'logLevelFilter',
        appender: 'out',
        level: process.env.LOG_LEVEL || 'info'
      }
    },
    categories: {
      default: {
        appenders: ['logFilter', 'file'],
        level: 'trace'
      }
    }
  })

  const logger = log4js.getLogger()
  const originalConsoleLog = console.log
  const originalConsoleWarn = console.warn
  const originalConsoleErr = console.error

  /**
   * 希望排除在log4js里的console输出，即不希望打到日志里去或者显示异常
   * @param {any[]} args
   */
  const whiteListConditionLog = (args) =>
    [
      args?.[0].startsWith(
        '▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄\n'
      ) /** 二维码扫码 */
    ].some(Boolean)

  console.log = function (...args) {
    if (args?.[1] instanceof Error) {
      logger.error(...args)
    } else if (!whiteListConditionLog(args)) {
      logger.info(...args) // 将输出写入 Log4js 配置的文件
    } else {
      originalConsoleLog.apply(console, args) // 保持控制台输出
    }
  }

  console.warn = function (...args) {
    if (!whiteListConditionLog(args)) {
      logger.warn(...args) // 将输出写入 Log4js 配置的文件
    } else {
      originalConsoleWarn.apply(console, args)
    }
  }

  console.error = function (...args) {
    if (!whiteListConditionLog(args)) {
      logger.error(...args) // 将输出写入 Log4js 配置的文件
    } else {
      originalConsoleErr.apply(console, args)
    }
  }

  module.exports.logger = log4js.getLogger()
  // cli环境使用console
} else {
  module.exports.logger = {
    /**
     * @param {*} payload
     */
    debug: (payload) => console.log(payload),
    /**
     * @param {*} payload
     */
    warn: (payload) => console.warn(payload),
    /**
     * @param {*} payload
     */
    error: (payload) => console.error(payload),
    /**
     * @param {*} payload
     */
    info: (payload) => console.log(payload),
    /**
     * @param {*} payload
     */
    trace: (payload) => console.log(payload)
  }
}
