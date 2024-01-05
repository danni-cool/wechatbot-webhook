const Utils = require('../utils/index.js')
const { sendMsg2RecvdApi } = require('./msgUploader.js')
const { MSG_TYPE_ENUM } = require('../config/const.js')
const rules = require('../config/valid.js')

/**
 * 根据v2群发逻辑整合归并状态方便调用和处理回调
 * @param {*} body
 * @param {{bot?:import('wechaty/impls').WechatyInterface, skipReceiverCheck?:boolean, messageReceiver?:msgInstanceType}} bot
 * */
const handleSendV2Msg = async function (
  body,
  { bot, skipReceiverCheck, messageReceiver }
) {
  let success = false
  let message = ''
  let status = 200

  const { state, task } = await handleSendV2MsgCollectInfo(body, {
    bot,
    skipReceiverCheck,
    messageReceiver
  })

  //有部分 or 全部参数校验不通过
  if (state === 'reject') {
    success = false
    message =
      'Some params is not valid, sending task is suspend, please checkout before sending message! You can find API reference right there (https://github.com/danni-cool/wechatbot-webhook#%EF%B8%8F-api)'

    // 全部发送成功 or 全部发送失败 or 部份发送成功
  } else if (state === 'pass') {
    // 全部发送成功
    if (task.successCount === task.totalCount) {
      success = true
      message = 'Message sent successfully'

      // 全部发送失败
    } else if (task.failedCount === task.totalCount) {
      success = false
      message = `All Messages (${task.totalCount}) sent failed, look up data of task for more detail`

      // 部份发送成功
    } else if (task.failedCount < task.totalCount) {
      success = true
      message =
        'Part of the message sent successfully, look up data of task for more detail'
    }
    // 未知错误
  } else {
    status = 500
    success = false
    message = 'Unknown Server Error'
  }

  return {
    status,
    success,
    task,
    message
  }
}

/**
 * 处理v2版本推消息（群发or个人）,返回状态
 * @param {*} body
 * @param {{bot?:import('wechaty/impls').WechatyInterface, skipReceiverCheck?:boolean, messageReceiver?:msgInstanceType}} opt
 * @returns {Promise<{state:'pass' | 'reject' | '', task:msgV2taskType}>}
 */
const handleSendV2MsgCollectInfo = async function (
  body,
  { bot, skipReceiverCheck = false, messageReceiver }
) {
  /**@type {'pass' | 'reject' | ''} */
  let state = ''
  /**@type {msgV2taskType} */
  const task = {
    successCount: 0,
    totalCount: 0,
    failedCount: 0,
    reject: [],
    sentFailed: [],
    notFound: []
  }

  /**
   * 根据状态组装数据
   * @param {statusResolverStatus} status
   * @param {statusResolverOpt} param1
   */
  function statusResolver(
    status,
    { rejectReasonObj, sendingTaskObj, notFoundObj, count = 0 }
  ) {
    switch (status) {
      case 'valid':
        task.totalCount += count
        break
      case 'unValidMsgParent':
      case 'unValidDataMsg':
      case 'RoomAliasNotSupported':
        task.totalCount += count
        // @ts-ignore
        task.reject.push(rejectReasonObj)
        // @ts-ignore
        rejectReasonObj.data
          ? // @ts-ignore
            (task.failedCount += rejectReasonObj?.data.length || 1)
          : task.failedCount++
        state = 'reject'
        break

      case 'not found':
        // @ts-ignore
        task.notFound.push(notFoundObj)
        // @ts-ignore
        task.failedCount++
        if (state !== 'reject') {
          state = 'pass'
        }
        break

      case 'SendingTaskDone':
      case 'batchSendingTaskDone':
        {
          // @ts-ignore
          const { failedTask, successCount } = sendingTaskObj

          if (failedTask) {
            task.sentFailed.push(failedTask)
            task.failedCount += failedTask.data.length
          }
          task.successCount += successCount
          if (state !== 'reject') {
            state = 'pass'
          }
        }
        break
    }
  }

  /**
   * 根据传入参数校验参数合法性，并且统计
   * @param {*} item
   */
  function preCheckAndResolveStatus(item) {
    const { status, rejectReasonObj, count } = hadnleMsgV2PreCheck(item, {
      skipReceiverCheck
    })

    statusResolver(status, {
      rejectReasonObj,
      count
    })

    return status === 'valid'
  }

  if (Array.isArray(body)) {
    const ifParamAllValid =
      body.reduce((pre, next) => {
        const val = preCheckAndResolveStatus(next)

        if (pre !== false) {
          pre = val
        }

        return pre
      }, true) === true

    if (ifParamAllValid) {
      // 参数校验成功进入发送逻辑
      for (let item of body) {
        const { status, rejectReasonObj, sendingTaskObj, notFoundObj } =
          await handleMsg2Single(item, { bot, messageReceiver })
        statusResolver(status, {
          rejectReasonObj,
          sendingTaskObj,
          notFoundObj
        })
      }
    }
  } else if (!Array.isArray(body) && (await preCheckAndResolveStatus(body))) {
    const { status, rejectReasonObj, sendingTaskObj, notFoundObj } =
      await handleMsg2Single(body, { bot, messageReceiver })
    statusResolver(status, {
      rejectReasonObj,
      sendingTaskObj,
      notFoundObj
    })
  }

  return {
    state,
    task
  }
}

/** 发送消息前预先校验参数
 * @param {*} body
 * @param {{skipReceiverCheck:boolean}} [opt]
 */
const hadnleMsgV2PreCheck = function (body, opt) {
  const skipReceiverCheck = !!opt?.skipReceiverCheck
  /** @type {preCheckStatus} */
  let status = 'valid'
  /** @type { msg2SingleRejectReason | null} */
  let rejectReasonObj = null
  /**@type {standardV2Payload} */
  const payload = {
    to: body.to,
    isRoom: body.isRoom,
    data: body.data,
    unValidParamsStr: ''
  }
  const count = Array.isArray(payload.data) ? payload.data.length : 1

  // 跳过发送主体校验（比如recvd单api回复消息，已经知道主体的情况下）
  if (!skipReceiverCheck) {
    // 校验必填参数
    payload.unValidParamsStr = Utils.getUnValidParamsList(
      rules.pushMsgV2ParentRules({
        to: payload.to,
        isRoom: payload.isRoom ?? false,
        data: payload.data
      })
    )
      .map(({ unValidReason }) => unValidReason)
      .join('，')

    if (payload.unValidParamsStr) {
      status = 'unValidMsgParent'
      rejectReasonObj = {
        to: payload.to,
        ...(payload.isRoom !== undefined ? { isRoom: payload.isRoom } : {}),
        error: payload.unValidParamsStr
      }
    }
  }

  const { to, isRoom } = payload

  // 继续校验 payload.data的结构
  let unValidDataParamsStr
  // 检查每条消息的合法性
  if (Array.isArray(payload.data)) {
    /**@type { rejectReasonDataType[]  } */
    const UnValidReasonArr = []
    //给省略了type的添加上type:text
    // @ts-ignore

    //检查每一条消息是否合法
    payload.data.forEach(
      /**
       * @param {pushMsgUnitTypeOpt} item
       */
      (item) => {
        const { type, content } = item

        const error = getPushMsgUnitUnvalidStr({
          type: type ?? 'text',
          content
        })

        if (error) {
          let tempObj = {
            error,
            ...item
          }
          UnValidReasonArr.push(tempObj)
        }

        return item
      }
    )

    //从payload.data 数组结构中有检测到不合法的结构
    if (UnValidReasonArr.length) {
      status = 'unValidDataMsg'
      rejectReasonObj = {
        ...(rejectReasonObj !== null ? rejectReasonObj : {}),
        to,
        isRoom,
        data: UnValidReasonArr
      }
    }
  } else {
    unValidDataParamsStr = getPushMsgUnitUnvalidStr({
      type: payload.data.type ?? 'text',
      content: payload.data.content
    })

    if (unValidDataParamsStr) {
      status = 'unValidDataMsg'

      rejectReasonObj = {
        ...(rejectReasonObj !== null ? rejectReasonObj : {}),
        to,
        isRoom,
        data: {
          ...payload.data,
          error: unValidDataParamsStr
        }
      }
    }
  }

  if (['unValidDataMsg', 'unValidMsgParent'].includes(status)) {
    return {
      status,
      rejectReasonObj,
      count
    }
  }

  if (isRoom === true) {
    if (typeof to === 'object') {
      status = 'RoomAliasNotSupported'
      return {
        status,
        rejectReasonObj: {
          to,
          isRoom,
          error:
            '群名只支持群昵称，please checkout the api reference (https://github.com/danni-cool/wechatbot-webhook#%EF%B8%8F-api)'
        },
        count
      }
    }
  }

  //参数校验通过
  return {
    status,
    rejectReasonObj,
    count
  }
}

/**
 * 处理消息发给个人逻辑（单条/多条）（不校验参数）
 * @param {*} body
 * @param {{bot?:import('wechaty/impls').WechatyInterface, messageReceiver?:msgInstanceType }} opt
 * @returns {Promise<{status: msg2SingleStatus, notFoundObj: msg2SingleRejectReason | null, rejectReasonObj: msg2SingleRejectReason|null, sendingTaskObj: sendingTaskType | null}>}
 */
const handleMsg2Single = async function (body, { bot, messageReceiver }) {
  /**@type {msg2SingleStatus} */
  let status = ''
  /** @type { msg2SingleRejectReason | null} */
  let rejectReasonObj = null
  /** @type {sendingTaskType | null} */
  let sendingTaskObj = null
  /** @type {msg2SingleRejectReason | null} */
  let notFoundObj = null

  const payload = {
    /** @type {string| {alias:string}} */
    to: body.to,
    /** @type {boolean| undefined} */
    isRoom: body.isRoom,
    /** @type {pushMsgUnitTypeOpt | pushMsgUnitTypeOpt[]} */
    data: body.data /** { "type": "", content: "" } */,
    unValidParamsStr: ''
  }

  const { to, isRoom } = payload

  let msgReceiver = messageReceiver

  // msgReceiver 可以由外部提供
  if (!msgReceiver && bot) {
    if (isRoom === true && typeof to === 'string') {
      msgReceiver = await bot.Room.find({ topic: to })
    } else {
      msgReceiver = await bot.Contact.find(
        //@ts-expect-error wechaty 貌似未定义 {alias:string} 的场景
        Utils.equalTrueType(to, 'object') ? to : { name: to }
      )
    }
  }

  if (msgReceiver !== undefined) {
    if (Array.isArray(payload.data) && payload.data.length) {
      /**@type {(pushMsgUnitTypeOpt & {success?:boolean, error?:string})[]} */
      let msgArr = payload.data
      for (let i = 0; i < msgArr.length; i++) {
        const { success, error } = await formatAndSendMsg({
          type: msgArr[i].type || 'text',
          // @ts-ignore
          content: msgArr[i].content,
          msgInstance: msgReceiver
        })
        msgArr[i].success = success
        if (!success) {
          msgArr[i].error = error.toString()
        }
      }

      const successCount = msgArr.filter(({ success }) => success).length
      const failedList = msgArr.filter(({ success }) => !success)

      status = 'batchSendingTaskDone'
      sendingTaskObj = {
        success: msgArr.some(({ success }) => success), //只要有消息发送成功就为true
        successCount: successCount,
        failedTask: failedList.length
          ? {
              to,
              ...(isRoom !== undefined ? { isRoom } : {}),
              data: msgArr
                .filter(({ success }) => !success)
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                .map(({ success, ...otherObj }) => otherObj)
            }
          : null
      }
    } else if (!Array.isArray(payload.data)) {
      const { success } = await formatAndSendMsg({
        type: payload.data.type ?? 'text',
        // @ts-ignore
        content: payload.data.content,
        msgInstance: msgReceiver
      })

      status = 'SendingTaskDone'
      sendingTaskObj = {
        success: success,
        successCount: Number(success),
        failedTask: success
          ? null
          : {
              to,
              ...(isRoom !== undefined ? { isRoom } : {}),
              data: [payload.data]
            }
      }
    }
  } else {
    status = 'not found'
    notFoundObj = {
      to: payload.to,
      ...(isRoom === undefined ? {} : { isRoom }),
      error: `${isRoom ? 'Room' : 'User'} is not found`,
      data: payload.data
    }
  }

  return {
    status,
    rejectReasonObj,
    sendingTaskObj,
    notFoundObj
  }
}

/**
 * 根据传入规则校验消息发送单元 type 和 content 是否合法
 * @param {pushMsgUnitTypeOpt} param
 */
const getPushMsgUnitUnvalidStr = function ({ type, content }) {
  return Utils.getUnValidParamsList(
    rules.pushMsgV2ChildRules({
      type,
      content
    })
  )
    .map(({ unValidReason }) => unValidReason)
    .join('，')
}

/**
 * 发送消息核心。这个处理程序将数据转换为标准格式，然后使用 wechaty 发送消息。
 * @type {{
 * (payload:{ type: 'text' | 'fileUrl'|'file', content: string| payloadFormFile, msgInstance: msgInstanceType }) : Promise<{success:boolean, error:any}>;
 * }}
 */
const formatAndSendMsg = async function ({ type, content, msgInstance }) {
  let success = false
  let error

  try {
    switch (type) {
      // 纯文本
      case 'text':
        //@ts-expect-errors 重载不是很好使，手动判断
        await msgInstance.say(content)
        break

      case 'fileUrl': {
        //@ts-expect-errors 重载不是很好使，手动判断
        const fileUrlArr = content.split(',')
        // 单文件
        if (fileUrlArr.length === 1) {
          //@ts-expect-errors 重载不是很好使，手动判断
          const file = await Utils.getMediaFromUrl(content)
          await msgInstance.say(file)
          break
        }

        // 多个文件的情况
        for (let i = 0; i < fileUrlArr.length; i++) {
          const file = await Utils.getMediaFromUrl(fileUrlArr[i])
          await msgInstance.say(file)
        }
        break
      }
      // 文件
      case 'file':
        {
          //@ts-expect-errors 重载不是很好使，手动判断
          await msgInstance.say(await Utils.getBufferFile(content))
        }
        break
      default:
        throw new Error('发送消息 type 不能为空')
    }
    success = true
  } catch (/** @type {any} */ e) {
    error = e
    Utils.logger.error(e)
  }

  return { success, error }
}

/**
 * 接受 Service.sendMsg2RecvdApi 的response 回调以便回复或作出其他动作
 * @param {Object} payload
 * @param {Response} [payload.res]
 * @param {import('@src/config/const.js').MSG_TYPE_ENUM} payload.type
 * @param {import('wechaty').Friendship} [payload.friendship]
 * @param {msgInstanceType} [payload.msgInstance]
 */
const handleResSendMsg = async ({ res, type, friendship, msgInstance }) => {
  // to 的逻辑
  // 个人
  // msgInstance.payload.name
  // 群名
  // msgInstance.payload.topic
  // 好友卡片
  // msgInstance.contact().name()

  let success, data, to, isRoom

  if (res?.ok) {
    const result = await res.json()

    if (!result) return

    success = result.success
    data = result.data
  }

  switch (type) {
    case MSG_TYPE_ENUM.CUSTOM_FRIENDSHIP:
      to = friendship?.contact().name()
      success === true
        ? //@ts-expect-errors 重载不是很好使，手动判断
          await friendship.accept()
        : Utils.logger.info(
            //@ts-expect-errors 重载不是很好使，手动判断
            `not auto accepted, because ${to}'s verify message is: ${friendship.hello()}`
          )

      // 同意且包含回复信息
      if (success === true && data !== undefined) {
        await Utils.sleep(1000)
        //@ts-expect-errors 重载不是很好使，手动判断
        recvdApiReplyHandler(data, friendship.contact(), to)
      }

      break

    default:
      //进入该分支一定有msgInstance，判断是为了让 ts happy
      if (success === true && data !== undefined && msgInstance) {
        await Utils.sleep(1000)
        //@ts-ignore
        isRoom = !!msgInstance.payload?.topic
        //@ts-ignore
        to = isRoom ? msgInstance.payload?.topic : msgInstance.payload.name
        recvdApiReplyHandler(data, { msgInstance, to, isRoom })
      }
      break
  }
}

/**
 * 处理消息回复api和加好友请求后的回复
 * @param {pushMsgUnitTypeOpt | pushMsgUnitTypeOpt[]} data
 * @param {{msgInstance:msgInstanceType, to:string, isRoom?:boolean}} opt
 */
const recvdApiReplyHandler = async (data, { msgInstance, to, isRoom }) => {
  // 组装标准的请求结构

  const { success, task, message, status } = await handleSendV2Msg(
    { to, isRoom, data },
    { skipReceiverCheck: true, messageReceiver: msgInstance }
  )

  sendMsg2RecvdApi(
    new Utils.TextMsg({
      text: JSON.stringify({
        event: 'notifyOfRecvdApiPushMsg',
        recvdApiReplyNotify: {
          success,
          task,
          message,
          status
        }
      }),
      isSystemEvent: true
    })
  )
}

/**
 * 收消息钩子
 * @param {import('wechaty').Message} msg
 */
const onRecvdMessage = async (msg) => {
  // 自己发的消息没有必要处理
  if (msg.self()) return

  handleResSendMsg({
    res: await sendMsg2RecvdApi(msg),
    type: msg.type(),
    msgInstance: msg
  })
}

module.exports = {
  formatAndSendMsg,
  handleResSendMsg,
  onRecvdMessage,
  getPushMsgUnitUnvalidStr,
  handleSendV2Msg
}
