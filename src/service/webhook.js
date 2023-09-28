const fetch = require('node-fetch-commonjs')
const FormData = require('form-data')
const sendMsg2RecvdWebHook = async function (msg, webhookUrl) {
  const msgData = {
    room: msg.room() || '',
    to: msg.to() || '',
    from: msg.talker() || '',
    type: '',
    content: null,
  }

  const formData = new FormData();
  let passed = true


  switch (msg.type()) {
    // 图片
    case 0:
    case 6:
      msgData.type = 'img'
      formData.append('data', JSON.stringify(msgData))
      const steamFile = await msg.toFileBox()
      formData.append('file', steamFile.buffer || new Uint8Array(steamFile.stream.buffer), { filename: 'image.jpg', contentType: 'image/jpeg' })
      break;

    // 纯文本
    case 7:
      msgData.type = 'text'
      msgData.content = msg.text()
      formData.append('data', JSON.stringify(msgData))
      break;

    // 其他统一暂不处理
    case 5: //表情
    default:
      passed = false
      break;
  }

  // 其他消息和本人发的消息不处理
  if (!passed || msg.self) return

  console.log('starting fetching api: ' + webhookUrl, msg.payload)

  await fetch(webhookUrl, {
    method: 'POST',
    body: formData
  })
}


module.exports = {
  sendMsg2RecvdWebHook
}