// const { serve } = require('@hono/node-server')
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

// 注册webhook
registerRoute({ app, bot })

serve({
  fetch: app.fetch,
  port: Number(PORT)
})
