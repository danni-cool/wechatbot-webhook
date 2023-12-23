const chalk = require('chalk')
const Service = require('./index')
const { TextMsg } = require('../utils/index')

// 缓存运行时的好友请求
const FriendShipList = new Map()

const onRecvdFriendship = async (friendship, botInstance) => {
  const { Friendship } = botInstance
  let logMsg

  try {
    logMsg = chalk.cyan(
      'received `friend` event from ' + friendship.contact().name(),
    )
    console.log(logMsg)

    switch (friendship.type()) {
      case Friendship.Type.Receive:
        Service.sendMsg2RecvdApi(new TextMsg({}, true))

        if (friendship.hello() === 'ding') {
          logMsg = 'accepted automatically because verify messsage is "ding"'
          console.log('before accept')
          await friendship.accept()

          // if want to send msg , you need to delay sometimes
          await new Promise((r) => setTimeout(r, 1000))
          await friendship.contact().say('hello from Wechaty')
          console.log('after accept')
        } else {
          logMsg =
            'not auto accepted, because verify message is: ' +
            friendship.hello()
        }
        break

      /**
       *
       * 2. Friend Ship Confirmed
       *
       */
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

// 接受制定id的好友邀请
const acceptFriend = async (id) => {
  if (FriendShipList.has(id)) {
    await FriendShipList[id].accept()
    // if want to send msg , you need to delay sometimes
    await new Promise((r) => setTimeout(r, 1000))
    FriendShipList.remove(id)
    return true
  }

  return false
}

module.exports = {
  onRecvdFriendship,
  acceptFriend,
}
