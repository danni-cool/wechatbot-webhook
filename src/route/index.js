/**
 * 注册路由
 * @param {Object} param
 * @param {import('hono').Hono} param.app
 * @param {import('wechaty').Wechaty} param.bot
 */
module.exports = function registerRoute({ app, bot }) {
  require('./msg')({ app, bot })
  require('./login')({ app, bot })
}
