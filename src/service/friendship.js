const onRecvdFriendship = async (friendship, botInstance) => {
  const { Friendship } = botInstance
  let logMsg

  try {
    logMsg = 'received `friend` event from ' + friendship.contact().name()
    console.log(logMsg)

    switch (friendship.type()) {
      /**
       *
       * 1. New Friend Request
       *
       * when request is set, we can get verify message from `request.hello`,
       * and accept this request by `request.accept()`
       */
      case Friendship.Type.Receive:
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
        logMsg = 'friend ship confirmed with ' + friendship.contact().name()
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
