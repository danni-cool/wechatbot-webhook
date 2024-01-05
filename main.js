const Utils = require('./src/utils/index')
Utils.proxyConsole()
require('dotenv').config({
  path: process.env.homeEnvCfg /** 兼容cli调用 */ ?? './.env'
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
