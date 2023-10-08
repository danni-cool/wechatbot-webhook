const fetch = require('node-fetch-commonjs')
const FormData = require('form-data')
const chalk = require('chalk')
const {
  LOCAL_RECVD_MSG_API,
  RECVD_MSG_API,
  LOGIN_API_TOKEN,
  LOCAL_LOGIN_API_TOKEN
} = process.env

const sendMsg2RecvdApi = async function (msg) {
  // 检测是否配置了webhookurl
  let webhookUrl
  let errorText = (key, value) => console.error(chalk.red(`配置参数 ${key}: ${chalk.cyan(value)} <- 不符合 URL 规范, 该 API 将不会收到请求\n`))

  // 外部传入了以外部为准
  if (!['', undefined].includes(RECVD_MSG_API)) {
    webhookUrl = ('' + RECVD_MSG_API).startsWith('http') ? RECVD_MSG_API : ''
    !webhookUrl && errorText('RECVD_MSG_API', RECVD_MSG_API)
    // 无外部则用本地
  } else if (!['', undefined].includes(LOCAL_RECVD_MSG_API)) {
    webhookUrl = ('' + LOCAL_RECVD_MSG_API).startsWith('http') ? LOCAL_RECVD_MSG_API : ''
    !webhookUrl && errorText('LOCAL_RECVD_MSG_API', LOCAL_RECVD_MSG_API)
  }
  // 有webhookurl才发送
  if (!webhookUrl) return

  const source = {
    room: msg.room() || '',
    to: msg.to() || '',
    from: msg.talker() || '',
  }

  let passed = true
  const formData = new FormData();

  formData.append('source', JSON.stringify(source))
  formData.append('isSystemEvent', msg.isSystemEvent ? '1' : '0')

  switch (msg.type()) {
    // 图片
    case 6:
      formData.append('type', 'img')
      const steamFile = await msg.toFileBox()
      formData.append('content', steamFile.buffer/** 发送一张新图 */ || steamFile.stream/** 同一张图转发 */,
        {
          filename: 'image.jpg',
          contentType: steamFile._mediaType.includes("text/plain") /** 复制后再发送得到的 mediaType 不正确，需要指定一个默认值，有可能会是png 用 jpeg 解析，暂时没有啥好的办法 */
            ? 'image/jpeg' :
            steamFile._mediaType
        })
      break;

    // 纯文本
    case 7:
      formData.append('type', 'text')
      formData.append('content', msg.text())
      break;

    // 其他统一暂不处理
    case 5: //表情
    default:
      passed = false
      break;
  }

  if (!passed || msg.self()) return

  console.log('starting fetching api: ' + webhookUrl, msg.payload)

  await fetch(webhookUrl, {
    method: 'POST',
    body: formData
  })
}

//得到 loginAPIToken
const getLoginApiToken = () => {
  if (!process.env.globalLoginToken) {
    process.env.globalLoginToken = LOGIN_API_TOKEN || LOCAL_LOGIN_API_TOKEN
  }

  return process.env.globalLoginToken
}



module.exports = {
  sendMsg2RecvdApi,
  getLoginApiToken
}