import { type Hono, type Context, type Next } from 'hono'
import Middleware from '../middleware/index'
import { wxProviderInterface } from '@/utils/types'

export function registerRoute({
  app,
  wxProvider = {} as wxProviderInterface
}: {
  app: Hono
  wxProvider: wxProviderInterface
}) {
  const attachData = (ctx: Context, next: Next) => {
    ctx.wxProvider = wxProvider
    return next()
  }
  // 挂载wecahty实例到全局路由
  app.use('*', attachData)
  // 全局鉴权
  app.use(Middleware.verifyToken)

  require('./msg')({ app, bot })
  require('./login')({ app, bot })
  require('./resouces')({ app, bot })
}
