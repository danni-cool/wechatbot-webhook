const Middleware = require('../middleware/index')
/**
 * 注册路由
 * @param {Object} param
 * @param {import('hono').Hono} param.app
 * @param {import('wechaty').Wechaty} param.bot
 */
module.exports = function registerRoute({ app, bot }) {
  /**
   * @param {import('hono').Context} ctx
   * @param {import('hono').Next} next
   */
  const attachData = (ctx, next) => {
    ctx.bot = bot
    return next()
  }
  // 挂载wecahty实例到全局路由
  app.use('*', attachData)
  // 全局鉴权
  app.use(Middleware.verifyToken)

  require('./msg')({ app, bot })
  require('./login')({ app, bot })
}
