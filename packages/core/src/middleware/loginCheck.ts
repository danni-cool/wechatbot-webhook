import { type Context, type Next } from 'hono'

export const loginCheck = async (c: Context, next: Next) => {
  if (!c.bot.isLoggedIn) {
    c.status(401)
    return c.json({
      success: false,
      message: 'you must login first'
    })
  }

  await next()
}
