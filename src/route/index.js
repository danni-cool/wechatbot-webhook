const Middleware = require('../middleware/index')
const fs = require('fs')
const path = require('path')
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

  // bugfix serveStatic cannot use a project root path, it actually based on cwd path
  app.get('/static/*', async (c) => {
    //获取*号的路径
    const filePath = path.join(__dirname, `../${c.req.path}`)
    return c.body(fs.readFileSync(filePath, {
      encoding: 'utf-8'
    }))
  })

  require('./msg')({ app, bot })
  require('./login')({ app, bot })
  require('./resouces')({ app, bot })
}
