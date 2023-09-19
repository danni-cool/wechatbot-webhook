const Utils = require('../utils/index')

module.exports = function registerRoomHook({ app, bot }) {

  // 处理 POST 请求
  app.post('/webhook/roomMsg', async (req, res) => {
    try {
      const { to, type, content } = req.body;

      // 查找指定的 Room
      const targetRoom = await bot.Room.find({ topic: to });

      if (targetRoom) {
        const msg = await Utils.convertMsg({ type, content })
        targetRoom.say(msg);

        res.status(200).json({ success: true, message: 'Message sent successfully.' });
      } else {
        res.status(404).json({ success: false, message: 'Room not found.' });
      }
    } catch (error) {
      console.error('Error handling POST request:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  });
} 