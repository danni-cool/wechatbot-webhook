const chalk = require('chalk')
const Service = require('./index')
const { FriendshipMsg } = require('../utils/msg')

const onRecvdFriendship = async (friendship, botInstance) => {
  const { Friendship } = botInstance
  let logMsg

  try {
    logMsg = chalk.cyan(
      'received `friend` event from ' + friendship.contact().name(),
    )
    console.log(logMsg)

    switch (friendship.type()) {
      // 收到好友邀请
      case Friendship.Type.Receive:
        {
          const response = await Service.sendMsg2RecvdApi(
            new FriendshipMsg({
              type: 'received',
              name: friendship.contact().name(),
              hello: friendship.hello(),
            }),
          )
          // 如果同意了
          if (response && response.ok) {
            const { success, message } = await response.json()

            success && (await friendship.accept())

            // 同意且包含回复信息
            if (message) {
              await new Promise((r) => setTimeout(r, 1000))
              await friendship.contact().say(message)
            }
          } else {
            logMsg =
              'not auto accepted, because verify message is: ' +
              friendship.hello()
          }
        }
        break

      // 申请的好友通过验证
      case Friendship.Type.Confirm:
        logMsg = chalk.cyan(
          'friend ship confirmed with ' + friendship.contact().name(),
        )
        break
    }
  } catch (e) {
    logMsg = e.message
  }
  console.log(logMsg)
}

module.exports = {
  onRecvdFriendship,
}
