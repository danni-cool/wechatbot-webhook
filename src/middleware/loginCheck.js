/**
 * middleware of login Check
 * @param {import('hono').Context} c
 * @param {import('hono').Next} next
 */
module.exports.loginCheck = async (c, next) => {
  if (!c.bot.isLoggedIn) {
    c.status(401)
    return c.json({
      success: false,
      message: 'you must login first before sending messages'
    })
  }

  await next()
}
