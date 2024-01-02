/** @typedef {{content:string, type: 'text'| 'fileUrl'}} msgDataType */

const Service = require('../service')
const Utils = require('../utils/index.js')

/**
 * 注册推消息钩子
 * @param {Object} payload
 * @param {import('hono').Hono} payload.app
 * @param {import('wechaty').Wechaty} payload.bot
 */
function registerPushHook({ app, bot }) {
  // 处理 POST 请求 V2 只支持多发模式
  app.post('/webhook/msg/v2', async (c) => {
    const body = await c.req.json()

    const payload = {
      /** @type {string| {alias:string}} */
      to: body.to,
      /** @type {boolean} */
      isRoom: body.isRoom ?? false,
      /** @type {msgDataType} */
      data: body.data /** { "type": "", content: "" } */,
      unValidParamsStr: ''
    }

    // 校验必填参数
    payload.unValidParamsStr = Utils.getUnValidParamsList([
      {
        key: 'to',
        val: payload.to,
        required: true,
        type: ['string', 'object'],
        unValidReason: ''
      },
      {
        key: 'isRoom',
        val: payload.isRoom,
        required: false,
        type: 'boolean',
        unValidReason: ''
      },
      {
        key: 'data',
        val: payload.data,
        required: true,
        type: ['object', 'array'],
        unValidReason: ''
      }
    ])
      .map(({ unValidReason }) => unValidReason)
      .join('，')

    const { to, isRoom, unValidParamsStr } = payload

    if (unValidParamsStr !== '') {
      return c.json({
        success: false,
        message: `[${unValidParamsStr}] params  is not valid, please checkout the api reference (https://github.com/danni-cool/wechatbot-webhook#%EF%B8%8F-api)`
      })
    }

    // 继续校验 payload.data的结构
    let unValidDataParamsStr
    // TODO: 需要提示
    if (Array.isArray(payload.data)) {
      console.log(1)
    } else {
      payload.data.type = payload.data.type ?? 'text'
      unValidDataParamsStr = Utils.getUnValidParamsList([
        {
          key: 'data.type',
          val: payload.data.type,
          required: false,
          type: 'string',
          enum: ['text', 'fileUrl'],
          unValidReason: ''
        },
        {
          key: 'data.content',
          val: payload.data.content,
          required: false,
          type: 'string',
          unValidReason: ''
        }
      ])
        .map(({ unValidReason }) => unValidReason)
        .join('，')
    }

    if (unValidDataParamsStr !== '') {
      return c.json({
        success: false,
        message: `[${unValidDataParamsStr}] params  is not valid, please checkout the api reference (https://github.com/danni-cool/wechatbot-webhook#%EF%B8%8F-api)`
      })
    }

    let msgReceiver

    if (isRoom) {
      if (typeof to === 'object') {
        return c.json({
          success: false,
          message:
            '群名只支持群昵称，please checkout the api reference (https://github.com/danni-cool/wechatbot-webhook#%EF%B8%8F-api)'
        })
      } else {
        msgReceiver = await bot.Room.find({ topic: to })
      }
    } else {
      msgReceiver = await bot.Contact.find(
        // @ts-expect-errors 此处已经做了正确的判断
        Utils.equalTrueType(to, 'object') ? to : { name: to }
      )
    }

    if (msgReceiver !== undefined) {
      const success = await Service.formatAndSendMsg({
        type: payload.data.type,
        content: payload.data.content,
        msgInstance: msgReceiver
      })

      return c.json({
        success,
        message: `Message sent ${success ? 'successfully' : 'failed'}`
      })
    } else {
      return c.json({
        success: false,
        message: `${isRoom ? 'Room' : 'User'} is not found`
      })
    }
  })

  // 处理 POST 请求 V1 只支持单发模式
  app.post('/webhook/msg', async (c) => {
    const formPayload = {}
    const payload = {}

    let body = null
    // 获取请求的 Content-Type
    const contentType = c.req.header('Content-Type')
    // 表单传文件(暂时只用来传文件)
    if (contentType && contentType.includes('multipart/form-data')) {
      body = await c.req.parseBody()
      /** @type {string} */
      // @ts-expect-errors 已经提前做了判断
      formPayload.to = body.to
      // @ts-expect-errors 已经提前做了判断
      formPayload.isRoom = body.isRoom ?? '0'
      /** @type {'file'} */
      formPayload.type = 'file'
      /** @type {payloadFormFile} */
      // @ts-expect-errors 已经提前做了判断
      formPayload.content = body.content ?? {}
      // 转化上传文件名中文字符但是被编码成 iso885910 的问题
      if (formPayload.content.name !== undefined) {
        formPayload.content.convertName = Utils.tryConvertCnCharToUtf8Char(
          formPayload.content.name
        )
      }

      // 校验必填参数
      let unValidParamsStr = Utils.getUnValidParamsList([
        {
          key: 'to',
          val: formPayload.to,
          required: true,
          type: 'string',
          unValidReason: ''
        },
        {
          key: 'isRoom',
          val: formPayload.isRoom,
          required: false,
          enum: ['1', '0'],
          type: 'string',
          unValidReason: ''
        },
        {
          key: 'content',
          val: formPayload.content.size ?? 0,
          required: true,
          type: 'file',
          unValidReason: ''
        }
      ]).map(({ unValidReason }) => unValidReason)
      /**@type {boolean} */
      formPayload.isRoom = Boolean(
        Number(formPayload.isRoom)
      ) /** "1" => true , "0" => false */

      // 支持jsonLike传递备注名 {alias: 123}
      if (/{\s*"?'?alias"?'?\s*:[^}]+}/.test(formPayload.to)) {
        try {
          formPayload.to = Utils.parseJsonLikeStr(formPayload.to)
        } catch (e) {
          unValidParamsStr = [
            'to 参数发消息给备注名， json string 格式不正确'
          ].concat(unValidParamsStr)
        }
      }
      formPayload.unValidParamsStr = unValidParamsStr.join('，')

      // json
    } else {
      body = await c.req.json()
      /** @type {string} */
      payload.to = body.to
      /** @type {boolean} */
      payload.isRoom = body.isRoom ?? false
      /** @type {'text'|'fileUrl'} */
      payload.type = body.type ?? 'text'
      /** @type {string} */
      payload.content = body.content

      // 校验必填参数
      payload.unValidParamsStr = Utils.getUnValidParamsList([
        {
          key: 'to',
          val: payload.to,
          required: true,
          type: ['string', 'object'],
          unValidReason: ''
        },
        {
          key: 'type',
          val: payload.type,
          required: false,
          type: 'string',
          enum: ['text', 'fileUrl'],
          unValidReason: ''
        },
        {
          key: 'content',
          val: payload.content,
          required: true,
          type: 'string',
          unValidReason: ''
        },
        {
          key: 'isRoom',
          val: payload.isRoom,
          required: false,
          type: 'boolean',
          unValidReason: ''
        }
      ])
        .map(({ unValidReason }) => unValidReason)
        .join('，')
    }

    const { to, isRoom, unValidParamsStr, type, content } =
      contentType?.includes('multipart/form-data') ? formPayload : payload

    if (unValidParamsStr !== '') {
      return c.json({
        success: false,
        message: `[${unValidParamsStr}] params  is not valid, please checkout the api reference (https://github.com/danni-cool/wechatbot-webhook#%EF%B8%8F-api)`
      })
    }

    const msgReceiver =
      isRoom === true
        ? await bot.Room.find({ topic: to })
        : await bot.Contact.find(
            Utils.equalTrueType(to, 'object') ? to : { name: to }
          )

    if (msgReceiver !== undefined) {
      const success = await Service.formatAndSendMsg({
        type,
        content,
        msgInstance: msgReceiver
      })

      return c.json({
        success,
        message: `Message sent ${success ? 'successfully' : 'failed'}`
      })
    } else {
      return c.json({
        success: false,
        message: `${isRoom === true ? 'Room' : 'User'} is not found`
      })
    }
  })
}

module.exports = registerPushHook
