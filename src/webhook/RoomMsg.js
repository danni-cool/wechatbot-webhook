const Utils = require('../utils/index')

module.exports = function registerRoomHook({ app, bot }) {

  // 处理 POST 请求
  app.post('/webhook/roomMsg', async (req, res) => {
    try {
      const { to, type, content } = req.body;

      //校验必填参数
      const checkList = [
        { key: 'to', val: to },
        { key: 'type', val: type },
        { key: 'content', val: content }
      ]

      if (checkList.some(({ val }) => !val)) {
        const unValidParamsStr = checkList
          .filter(({ val })=> !val)
          .map(({key}) => key)
          .join(',')

        return res.status(200).json({ success: false, message: `[${unValidParamsStr}] params  is not valid, please checkout the api reference (https://github.com/danni-cool/docker-wechat-roomBot#body-%E5%8F%82%E6%95%B0%E8%AF%B4%E6%98%8E)` });
      }

      // 查找指定的 Room
      const targetRoom = await bot.Room.find({ topic: to });

      if (targetRoom) {
        const sendStatus = await Utils.formatAndSendMsg({ type, content, msgInstance: targetRoom, res })
        res.status(200).json({ success: sendStatus, message: `Message sent ${sendStatus ? 'successfully' : 'failed' }.` });

      } else {
        res.status(200).json({ success: false, message: 'Room is not found' });
      }
    } catch (error) {
      console.error('Error handling POST request:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  });
} 