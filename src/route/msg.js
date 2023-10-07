const { formatAndSendMsg } = require('../service/msg')
const { getUnvalidParamsList } = require('../utils/index')

module.exports = function registerPushHook({ app, bot }) {

  // 处理 POST 请求
  app.post('/webhook/msg', async (req, res) => {
    try {
      const { to, isRoom = false, type, content } = req.body;

      //校验必填参数
      const unValidParamsStr = getUnvalidParamsList([
        { key: 'to', val: to, required: true, type: 'string', unValidReason: '' },
        { key: 'type', val: type, required: true, type: 'string', enum: ['text', 'img'], unValidReason: '' },
        { key: 'content', val: content, required: true, type: 'string', unValidReason: '' },
        { key: 'isRoom', val: isRoom, required: false, type: 'boolean', unValidReason: '' }
      ])
        .map(({ unValidReason }) => unValidReason).join('，')

      if (unValidParamsStr) {
        return res.status(200).json({ success: false, message: `[${unValidParamsStr}] params  is not valid, please checkout the api reference (https://github.com/danni-cool/docker-wechat-roomBot#body-%E5%8F%82%E6%95%B0%E8%AF%B4%E6%98%8E)` });
      }

      const msgReceiver = isRoom ?
        await bot.Room.find({ topic: to }) :
        await bot.Contact.find({ name: to })

      if (msgReceiver) {
        const sendStatus = await formatAndSendMsg({ type, content, msgInstance: msgReceiver, res })
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