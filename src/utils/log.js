const {
  logOnlyOutputWhiteList,
  logDontOutpuptBlackList
} = require('../config/log4jsFilter')

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

  /**@type {log4js.Logger} */
  let logger = log4js.getLogger()
  const originalConsoleLog = console.log
  const originalConsoleWarn = console.warn
  const originalConsoleErr = console.error

  const proxyConsole = () => {
    // logger.level = logLevel
    /**
     * 希望排除在log4js里的console输出，即不希望打到日志里去或者显示异常
     * @param {any[]} args
     */
    const whiteListConditionLog = (args) => {
      const arg0 = args?.[0]

      return logOnlyOutputWhiteList
        .map((str) => typeof arg0 === 'string' && arg0.includes(str))
        .some(Boolean)
    }

    /**
     * 希望排除一些错误
     * @param {any[]} args
     * @returns {boolean}
     */
    const blackListConditionError = (args) => {
      const arg0 = args?.[0]

      return logDontOutpuptBlackList.some((str) => arg0.includes(str))
    }

    console.log = function (...args) {
      try {
        if (args?.[1] instanceof Error) {
          logger.error(...args)
        } else if (!whiteListConditionLog(args)) {
          logger.info(...args) // 将输出写入 Log4js 配置的文件
        } else {
          originalConsoleLog.apply(console, args) // 保持控制台输出
        }
      } catch (/**@type {any} **/ e) {
        originalConsoleLog.apply(console, args)
        throw new Error('log4js 记录 console.log 出错:', e)
      }
    }

    console.warn = function (...args) {
      try {
        if (!whiteListConditionLog(args)) {
          logger.warn(...args) // 将输出写入 Log4js 配置的文件
        } else {
          originalConsoleWarn.apply(console, args)
        }
      } catch (/**@type {any} **/ e) {
        originalConsoleWarn.apply(console, args)
        throw new Error('log4js 记录 console.warn 出错:', e)
      }
    }

    console.error = function (...args) {
      try {
        if (blackListConditionError(args)) return

        if (!whiteListConditionLog(args)) {
          logger.error(...args) // 将输出写入 Log4js 配置的文件
        } else {
          originalConsoleErr.apply(console, args)
        }
      } catch (/**@type {any} **/ e) {
        originalConsoleErr.apply(console, args)
        throw new Error('log4js 记录 console.error 出错:', e)
      }
    }
  }

  module.exports = {
    // @ts-ignore
    logger,
    proxyConsole
  }
  // cli环境使用console
} else {
  // @ts-ignore
  module.exports = {
    proxyConsole() {},
    logger: {
      /**
       * @param {*} payload
       */
      debug: (...payload) => console.log.apply(console, payload),
      /**
       * @param {*} payload
       */
      warn: (...payload) => console.warn.apply(console, payload),
      /**
       * @param {*} payload
       */
      error: (...payload) => console.error.apply(console, payload),
      /**
       * @param {*} payload
       */
      info: (...payload) => console.log.apply(console, payload),
      /**
       * @param {*} payload
       */
      trace: (...payload) => console.log.apply(console, payload)
    }
  }
}
