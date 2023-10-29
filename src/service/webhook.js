const fetch = require('node-fetch-commonjs')
const FormData = require('form-data')
const chalk = require('chalk')
const {
  LOCAL_RECVD_MSG_API,
  RECVD_MSG_API,
  LOGIN_API_TOKEN,
  LOCAL_LOGIN_API_TOKEN,
} = process.env
let fileTypeFromBuffer

import('file-type').then((res) => {
  fileTypeFromBuffer = res.fileTypeFromBuffer
})

const sendMsg2RecvdApi = async function (msg) {
  // 自己发的消息没有必要转发
  if (msg.self()) return

  // 检测是否配置了webhookurl
  let webhookUrl
  const errorText = (key, value) =>
    console.error(
      chalk.red(
        `配置参数 ${key}: ${chalk.cyan(
          value,
        )} <- 不符合 URL 规范, 该 API 将不会收到请求\n`,
      ),
    )

  // 外部传入了以外部为准
  if (!['', undefined].includes(RECVD_MSG_API)) {
    webhookUrl = ('' + RECVD_MSG_API).startsWith('http') ? RECVD_MSG_API : ''
    !webhookUrl && errorText('RECVD_MSG_API', RECVD_MSG_API)
    // 无外部则用本地
  } else if (!['', undefined].includes(LOCAL_RECVD_MSG_API)) {
    webhookUrl = ('' + LOCAL_RECVD_MSG_API).startsWith('http')
      ? LOCAL_RECVD_MSG_API
      : ''
    !webhookUrl && errorText('LOCAL_RECVD_MSG_API', LOCAL_RECVD_MSG_API)
  }

  // 有webhookurl才发送
  if (!webhookUrl) return

  const roomInfo = msg.room()

  if (roomInfo) {
    const roomMemberInfo = await msg.room().memberAll()
    roomInfo.payload.memberList = roomMemberInfo.map((item) => ({
      id: item.payload.id,
      name: item.payload.name,
      alias: item.payload.alias,
    }))
    // we have memberList already
    delete roomInfo.payload.memberIdList
  }

  const source = {
    /** room的话解析群成员信息，原始信息不会带 */
    room: roomInfo || '',
    to: msg.to() || '',
    from: msg.talker() || '',
  }

  let passed = true
  const formData = new FormData()

  formData.append('source', JSON.stringify(source))
  formData.append('isSystemEvent', msg.isSystemEvent ? '1' : '0')

  // 有人@我
  const someoneMentionMe =
    msg.mentionSelf &&
    (await msg.mentionSelf()) /** 原版@我，wechaty web版应该都是false */
  formData.append('isMentioned', someoneMentionMe ? '1' : '0')

  switch (msg.type()) {
    case 1: // 附件
    case 2: // 语音
    case 6: // 图片
    case 15: {
      // 视频
      formData.append('type', 'file')
      const steamFile = await msg.toFileBox()
      const type = await fileTypeFromBuffer(
        steamFile.buffer || steamFile.stream,
      )
      let fileInfo = { ext: '', mime: '' }

      // 文件类型尝试解析
      if (type) {
        fileInfo = {
          // _name:'unknown.txt' => unknown.jpg
          filename:
            steamFile.mimeType ===
            'application/unknown' /** 截图等无法推断出文件名会变成 unknown.txt */
              ? `${Date.now()}.${type.ext}`
              : steamFile._name || `${Date.now()}.${type.ext}`,
          ext: type.ext,
          mime: type.mime,
        }
        // 解析不出来尝试用文件后缀名
      } else {
        fileInfo = {
          filename: steamFile._name || 'UnknownFile',
          ext: steamFile._name.split('.').pop(),
          mime: steamFile._mediaType,
        }
      }

      formData.append(
        'content',
        steamFile.buffer /** 发送一个文件 */ ||
          steamFile.stream /** 同一个文件转发 */,
        {
          filename: fileInfo.filename,
          contentType: fileInfo.mime,
        },
      )
      break
    }
    // 分享的Url
    case 14: {
      const { payload } = await msg.toUrlLink()
      formData.append('type', 'urlLink')
      formData.append('content', JSON.stringify(payload))
      break
    }

    // 纯文本
    case 7:
      formData.append('type', 'text')
      formData.append('content', msg.text())
      break

    // 其他统一暂不处理
    case 5: // 自定义表情
    default:
      passed = false
      break
  }

  if (!passed) return

  console.log('starting fetching api: ' + webhookUrl, formData._streams)

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      console.error(
        `HTTP error When trying to send Data to RecvdApi: ${response.status}`,
      )
    }
  } catch (e) {
    console.error('Error occurred when trying to send Data to RecvdApi', e)
  }
}

// 得到 loginAPIToken
const getLoginApiToken = () => {
  if (!process.env.globalLoginToken) {
    process.env.globalLoginToken = LOGIN_API_TOKEN || LOCAL_LOGIN_API_TOKEN
  }

  return process.env.globalLoginToken
}

module.exports = {
  sendMsg2RecvdApi,
  getLoginApiToken,
}
