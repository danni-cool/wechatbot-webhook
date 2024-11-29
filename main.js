require('dotenv').config({
  path: process.env.homeEnvCfg /** 兼容cli调用 */ ?? './.env'
})
require('./src/utils/index').proxyConsole()
const { PORT } = process.env
const { Hono } = require('hono')
const { serve } = require('@hono/node-server')
const wechatBotInit = require('./src/wechaty/init')
const registerRoute = require('./src/route')
const bot = wechatBotInit()
const app = new Hono()

registerRoute({ app, bot })

serve({
  hostname: '0.0.0.0',
  fetch: app.fetch,
  port: Number(PORT)
})
