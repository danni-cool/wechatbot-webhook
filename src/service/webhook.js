const fetch = require('node-fetch-commonjs')

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
    case 6:
      msgData.type = 'img'
      const steamFile = await msg.toFileBox()
      const uint8Array = new Uint8Array(steamFile.stream.buffer);
      formData.append('data', JSON.stringify(msgData))
      formData.append('file',new Blob([uint8Array]), 'image.jpg')
      break;

    // 纯文本
    case 7:
      msgData.type = 'text'
      msgData.content = msg.text()
      formData.append('data', JSON.stringify(msgData))
      break;

    // 其他统一暂不处理
    default:
      passed = false
      break;
  }

  if(!passed) return

  console.log('starting fetching api: ' + webhookUrl, msg.payload)

  await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data', // 通常用于包含文件和其他数据
    },
    body: formData
  })
}


module.exports = {
  sendMsg2RecvdWebHook
}