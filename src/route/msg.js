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
    const body = await c.req.json()

    const payload = {
      /** @type {string| {alias:string}} */
      to: body.to,
      /** @type {boolean} */
      isRoom: body.isRoom ?? false,
      /** @type {pushMsgUnitPayload} */
      data: body.data /** { "type": "", content: "" } */,
      unValidParamsStr: ''
    }

    // 校验必填参数
    payload.unValidParamsStr = Utils.getUnValidParamsList(
      rules.pushMsgV2ParentRules({
        to: payload.to,
        isRoom: payload.isRoom,
        data: payload.data
      })
    )
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
    /**@type {(pushMsgUnitPayload & {success: boolean})[] | []} */
    let msgArr = []
    // 检查每条消息的合法性
    if (Array.isArray(payload.data)) {
      let UnValidReasonArr = {
        to,
        isRoom,
        /**@type { { rejectReason:string, type?:'text'|'fileUrl', content: string}[]  } */
        data: []
      }
      //给省略了type的添加上type:text
      // @ts-ignore
      msgArr = payload.data.map(
        /**
         * @param {pushMsgUnitTypeOpt} item
         */
        (item) => {
          const { type, content } = item

          const rejectReason = Service.getPushMsgUnitUnvalidStr({
            type: type || 'text',
            content
          })

          if (rejectReason) {
            let tempObj = {
              rejectReason,
              content: ''
            }
            Object.assign(tempObj, item)
            UnValidReasonArr.data.push(tempObj)
          }

          if (!type) {
            item.type = 'text'
          }

          return item
        }
      )

      //从payload.data 数组结构中有检测到不合法的结构
      if (UnValidReasonArr.data.length) {
        return c.json({
          success: false,
          message: `some msg params listed in (errorFields) is not valid, please checkout the api reference (https://github.com/danni-cool/wechatbot-webhook#%EF%B8%8F-api)`,
          errorFields: [UnValidReasonArr]
        })
      }
    } else {
      payload.data.type = payload.data.type ?? 'text'
      unValidDataParamsStr = Service.getPushMsgUnitUnvalidStr({
        type: payload.data.type,
        content: payload.data.content
      })
    }

    if (unValidDataParamsStr) {
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
      //批量消息发送
      if (msgArr.length) {
        for (let i = 0; i < msgArr.length; i++) {
          msgArr[i].success = await Service.formatAndSendMsg({
            type: msgArr[i].type,
            content: msgArr[i].content,
            msgInstance: msgReceiver
          })
        }

        const successCount = msgArr.filter(({ success }) => success).length
        const failedList = msgArr.filter(({ success }) => !success)
        return c.json({
          success: msgArr.some(({ success }) => success), //只要有消息发送成功就为true
          message: `Message sent ${successCount} of ${msgArr.length} are successed`,
          ...(failedList.length
            ? {
                failedTask: {
                  to,
                  isRoom,
                  data: msgArr.filter(({ success }) => !success)
                }
              }
            : {})
        })
      } else {
        const success = await Service.formatAndSendMsg({
          type: payload.data.type,
          content: payload.data.content,
          msgInstance: msgReceiver
        })
        return c.json({
          success,
          message: `Message sent ${success ? 'successfully' : 'failed'}`
        })
      }
    } else {
      return c.json({
        success: false,
        message: `${isRoom ? 'Room' : 'User'} is not found`
      })
    }
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
      body = await c.req.parseBody()
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
