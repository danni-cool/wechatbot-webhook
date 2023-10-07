// 登录
module.exports = function registerLoginCheck({ app, bot }) {
  let message,
    success = false

  bot
    .on('scan', qrcode => {
      message = 'https://wechaty.js.org/qrcode/' + encodeURIComponent(qrcode)
      success = false
    })
    .on('login', user => {
      message = user + 'is already login'
      success = true
    })
    .on('logout', user => {
      message = ''
      success = false
    })

  // 处理 POST 请求
  app.get('/loginCheck', async (req, res) => {

    // getLoginApiToken
    const { token } = req.query

    if (token !== process.env.globalLoginToken) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Access is denied due to invalid credentials.'
      });
    }

    try {
      res.status(200).json({
        success,
        message
      })

    } catch (error) {
      console.error('Error handling POST request:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  });
} 