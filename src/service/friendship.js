const chalk = require('chalk')
const Service = require('./index')
const { FriendshipMsg } = require('../utils/msg')
const { MSG_TYPE_ENUM } = require('../config/const')
const onRecvdFriendship = async (friendship, botInstance) => {
  const { Friendship } = botInstance

  let logMsg = chalk.cyan(
    'received `friend` event from ' + friendship.contact().name(),
  )
  console.log(logMsg)

  switch (friendship.type()) {
    // 收到好友邀请
    case Friendship.Type.Receive:
      Service.handleResSendMsg({
        res: await Service.sendMsg2RecvdApi(
          new FriendshipMsg({
            name: friendship.contact().name(),
            hello: friendship.hello(),
          }),
        ),
        type: MSG_TYPE_ENUM.CUSTOM_FRIENDSHIP,
        contact: friendship.contact(),
        friendship,
      })

      break

    // 申请的好友通过验证
    case Friendship.Type.Confirm:
      logMsg = chalk.cyan(
        'friend ship confirmed with ' + friendship.contact().name(),
      )
      break
  }

  console.log(logMsg)
}

module.exports = {
  onRecvdFriendship,
}
