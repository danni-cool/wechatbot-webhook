const { formatAndSendMsg } = require('../service/msg')
const { getUnvalidParamsList } = require('../utils/index')
const { dynamicStorageMiddleware } = require('../middleware/fileUpload')

module.exports = function registerPushHook({ app, bot }) {

  // 处理 POST 请求
  app.post('/webhook/msg', dynamicStorageMiddleware, async (req, res) => {
    try {
      let to, isRoom, content, type
      let unValidParamsStr = ''

      // 表单传文件(暂时只用来传文件)
      if (req.is('multipart/form-data')) {
        to = req.body.to
        isRoom = req.body.isRoom || '0'
        content = req.files.find(item => item.fieldname === 'content') || {}
        type = 'file'

        //校验必填参数
        unValidParamsStr = getUnvalidParamsList([
          { key: 'to', val: to, required: true, type: 'string', unValidReason: '' },
          { key: 'isRoom', val: isRoom, required: false, enum: ['1', '0'], type: 'string', unValidReason: '' },
          { key: 'content', val: content.size || 0, required: true, type: 'file', unValidReason: '' },
        ])
          .map(({ unValidReason }) => unValidReason).join('，')
        isRoom = !!+isRoom /** "1" => true , "0" => false */

        // json
      } else {
        to = req.body.to
        isRoom = req.body.isRoom || false
        type = req.body.type
        content = req.body.content

        //校验必填参数
        unValidParamsStr = getUnvalidParamsList([
          { key: 'to', val: to, required: true, type: 'string', unValidReason: '' },
          { key: 'type', val: type, required: true, type: 'string', enum: ['text', 'img', 'file', 'fileUrl'], unValidReason: '' },
          { key: 'content', val: content, required: true, type: 'string', unValidReason: '' },
          { key: 'isRoom', val: isRoom, required: false, type: 'boolean', unValidReason: '' }
        ])
          .map(({ unValidReason }) => unValidReason).join('，')
      }

      if (unValidParamsStr) {
        return res.status(200).json({ success: false, message: `[${unValidParamsStr}] params  is not valid, please checkout the api reference (https://github.com/danni-cool/docker-wechatbot-webhook#body-%E5%8F%82%E6%95%B0%E8%AF%B4%E6%98%8E)` });
      }

      const msgReceiver = isRoom ?
        await bot.Room.find({ topic: to }) :
        await bot.Contact.find({ name: to })

      if (msgReceiver) {
        const sendStatus = await formatAndSendMsg({ bot, type, content, msgInstance: msgReceiver, res })
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