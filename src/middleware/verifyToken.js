/**
 * middleware of token verification
 * @param {import('hono').Context} c
 * @param {import('hono').Next} next
 */
module.exports.verifyToken = async (c, next) => {
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
