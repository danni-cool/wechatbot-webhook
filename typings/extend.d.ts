import { WechatyInterface } from 'wechaty/impls'

declare module 'hono' {
  interface Context {
    bot: WechatyInterface
  }
}
