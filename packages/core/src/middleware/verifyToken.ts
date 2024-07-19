import { type Context, type Next } from 'hono'

export const verifyToken = async (c: Context, next: Next) => {
  const { token } = c.req.query()

  if (token !== process.env.globalLoginToken) {
    c.status(401)
    return c.json({
      success: false,
      message: 'Unauthorized: Access is denied due to invalid credentials.'
    })
  }

  await next()
}
