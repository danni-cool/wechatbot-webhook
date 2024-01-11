require('dotenv').config({
  path: process.env.homeEnvCfg /** 兼容cli调用 */ ?? './.env'
})
/** log 在 prestart 阶段初始化了，后续需要手动改level才能同步env配置  */
require('./src/utils/index').proxyConsole({
  logLevel: process.env.LOG_LEVEL
})
const { PORT } = process.env
const { Hono } = require('hono')
const { serve } = require('@hono/node-server')
const wechatBotInit = require('./src/wechaty/init')
const registerRoute = require('./src/route')
const bot = wechatBotInit()
const app = new Hono()

/**
 * @param {import('hono').Context} ctx
 * @param {import('hono').Next} next
 */
const attachData = (ctx, next) => {
  ctx.bot = bot
  return next()
}

app.use('*', attachData)

// 注册webhook
registerRoute({ app, bot })

serve({
  fetch: app.fetch,
  port: Number(PORT)
})
