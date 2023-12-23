const Service = require('../service')
const Middleware = require('../middleware')

module.exports = function registerFriendship({ app, bot }) {
  // 处理接受好友请求
  app.get(
    '/friendship/accept',
    Middleware.verifyToken,
    Service.handleError(async (req, res) => {
      const { id } = req.query

      res.status(200).json({
        success: true,
        message: { id },
      })
    }),
  )
}
