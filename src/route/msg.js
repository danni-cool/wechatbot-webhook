const Service = require('../service')
const Utils = require('../utils/index.js')
const rules = require('../config/valid')
const middleware = require('../middleware')
/**
 * 注册推消息钩子
 * @param {Object} payload
 * @param {import('hono').Hono} payload.app
 * @param {import('wechaty').Wechaty} payload.bot
 */
function registerPushHook({ app, bot }) {
  // 处理 POST 请求 V2 支持多发模式
  app.post('/webhook/msg/v2', middleware.loginCheck, async (c) => {
    let body

    try {
      body = await c.req.json()
    } catch (e) {
      return c.json({
        success: false,
        message: 'request body is not a valid json! checkout please.'
      })
    }

    const { success, task, message, status } = await Service.handleSendV2Msg(
      body,
      { bot }
    )

    if (status !== 200) {
      c.status(status)
    }

    return c.json({
      success,
      message,
      task
    })
  })

  // 处理 POST 请求 V1 只支持单发模式
  app.post('/webhook/msg', middleware.loginCheck, async (c) => {
    const formPayload = {}
    const payload = {}

    let body = null
    // 获取请求的 Content-Type
    const contentType = c.req.header('Content-Type')
    // 表单传文件(暂时只用来传文件)
    if (contentType && contentType.includes('multipart/form-data')) {
      try {
        body = await c.req.parseBody()
      } catch (e) {
        return c.json({
          success: false,
          message: 'request body is not a valid form-data! checkout please.'
        })
      }

      /** @type {any} */
      formPayload.to = body.to
      /** @type {any} */
      formPayload.isRoom = body.isRoom ?? '0'
      /** @type {'file'} */
      formPayload.type = 'file'
      /** @type {any} */
      formPayload.content = body.content ?? {}
      // 转化上传文件名中文字符但是被编码成 iso885910 的问题
      if (formPayload.content.name !== undefined) {
        formPayload.content.convertName = Utils.tryConvertCnCharToUtf8Char(
          formPayload.content.name
        )
      }

      // 校验必填参数
      let unValidParamsStr = Utils.getUnValidParamsList(
        rules.pushFileMsgRules({
          to: formPayload.to,
          /**@type {boolean} */
          isRoom: formPayload.isRoom,
          content: formPayload.content.size
        })
      ).map(({ unValidReason }) => unValidReason)

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
      try {
        body = await c.req.json()
      } catch (e) {
        return c.json({
          success: false,
          message: 'request body is not a valid json! checkout please.'
        })
      }

      /** @type {string} */
      payload.to = body.to
      /** @type {boolean} */
      payload.isRoom = body.isRoom ?? false
      /** @type {'text'|'fileUrl'} */
      payload.type = body.type ?? 'text'
      /** @type {string} */
      payload.content = body.content

      // 校验必填参数
      payload.unValidParamsStr = Utils.getUnValidParamsList(
        rules.pushMsgV1Rules({
          to: payload.to,
          type: payload.type,
          content: payload.content,
          isRoom: payload.isRoom
        })
      )
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
      const { success, error } = await Service.formatAndSendMsg({
        isRoom,
        bot,
        type,
        content,
        customFileName: "",
        msgInstance: msgReceiver
      })

      return c.json({
        success,
        message: `Message sent ${success ? 'successfully' : 'failed'}`,
        error
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
