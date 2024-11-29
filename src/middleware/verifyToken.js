/**
 * Get token from query or referer
 * @param {import('hono').Context} c
 * @returns {string|null}
 */
const getToken = (c) => {
  // 首先检查当前请求的query参数
  const token = c.req.query('token')
  if (token) {
    return token
  }

  // 如果当前请求没有token，检查referer
  const referer = c.req.header('referer')
  if (referer) {
    try {
      const refererUrl = new URL(referer)
      return refererUrl.searchParams.get('token')
    } catch (error) {
      console.error('Invalid referer URL:', error)
    }
  }

  return null
}


/**
 * middleware of token verification
 * @param {import('hono').Context} c
 * @param {import('hono').Next} next
 */
module.exports.verifyToken = async (c, next) => {
  // const { token } = c.req.query()
  const token = getToken(c)

  if (token !== process.env.globalLoginToken) {
    c.status(401)
    return c.json({
      success: false,
      message: 'Unauthorized: Access is denied due to invalid credentials.'
    })
  }

  await next()
}
