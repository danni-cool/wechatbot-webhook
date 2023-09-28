const { formatAndSendMsg } = require('../service/msg')

module.exports = function registerPushHook({ app, bot }) {

  // 处理 POST 请求
  app.post('/webhook/msg', async (req, res) => {
    try {
      const { to, isRoom = false, type, content } = req.body;

      //校验必填参数
      const checkList = [
        { key: 'to', val: to },
        { key: 'type', val: type },
        { key: 'content', val: content }
      ]

      if (checkList.some(({ val }) => !val)) {
        const unValidParamsStr = checkList
          .filter(({ val }) => !val)
          .map(({ key }) => key)
          .join(',')

        return res.status(200).json({ success: false, message: `[${unValidParamsStr}] params  is not valid, please checkout the api reference (https://github.com/danni-cool/docker-wechatbot-webhook#API)` });
      }

      const targetMsgReceiver = isRoom ?
        await bot.Room.find({ topic: to }) :
        await bot.Contact.find({ name: to })

      if (targetMsgReceiver) {
        const sendStatus = await formatAndSendMsg({ type, content, msgInstance: targetMsgReceiver, res })
        res.status(200).json({ success: sendStatus, message: `Message sent ${sendStatus ? 'successfully' : 'failed'}.` });
      } else {
        res.status(200).json({ success: false, message: `${isRoom ? 'Room' : 'User'} is not found` });
      }

    } catch (error) {
      console.error('Error handling POST request:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  });
} 