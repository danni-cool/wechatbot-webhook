const { downloadFile } = require('../utils/index')
const middleware = require('../middleware')
/**
 * 通过该接口代理获取微信静态资源
 * @param {Object} param
 * @param {import('hono').Hono} param.app
 * @param {import('wechaty').Wechaty} param.bot
 */
module.exports = function registerResourceAgentRoute({ app, bot }) {
  app.get(
    '/resouces',
    middleware.loginCheck,
    /** @param {import('hono').Context} c */
    async (c) => {
      // 暂时不考虑其他puppet的情况
      const cookie =
        // @ts-ignore 私有变量
        bot.__puppet._memory.payload['\rpuppet\nPUPPET-WECHAT4U'].COOKIE
      const mediaUrl = c.req.query('media')
      const fullResouceUrl = `https://wx2.qq.com${decodeURIComponent(
        mediaUrl || ''
      )}`

      const { buffer, contentType } = await downloadFile(fullResouceUrl, {
        Cookie: Object.entries(cookie).reduce(
          (pre, next) => (pre += `${next[0]}=${next[1]};`),
          ''
        )
      })
      if (buffer) {
        contentType && c.header('Content-Type', contentType)
        return c.body(buffer)
      } else {
        c.status(404)
        return c.json({ success: false, message: '获取资源失败' })
      }
    }
  )
}
