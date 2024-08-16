// require('dotenv').config({
//   path: process.env.homeEnvCfg /** 兼容cli调用 */ ?? './.env'
// })
// require('./src/utils/index').proxyConsole()
import { envType, wxProviderInterface } from '@/utils/types'
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import registerRoute from '@/core/src/route'

export default class WXBotHttpService {
  public config: envType
  private wxProvider: wxProviderInterface

  constructor({
    envCfg = {} as envType,
    wxProvider = {} as wxProviderInterface
  }) {
    this.config = envCfg
    this.wxProvider = wxProvider
  }

  use(wxProvider: wxProviderInterface) {
    this.wxProvider = wxProvider
    return this
  }

  start() {
    const app = new Hono()
    // const wechatBotInit = require('./src/wechaty/init')
    // const bot = wechatBotInit()
    registerRoute({ app, bot })

    serve({
      fetch: app.fetch,
      port: Number(this.config.PORT)
    })
  }
}
