const Utils = require('../utils/index')
const { handleResSendMsg } = require('./msgSender')
const { sendMsg2RecvdApi } = require('./msgUploader')
const { FriendshipMsg } = require('../utils/msg.js')
const { MSG_TYPE_ENUM } = require('../config/const')
/**
 * @param {import('wechaty').Friendship} friendship
 * @param {import('wechaty/impls').WechatyInterface} botInstance
 */
const onRecvdFriendship = async (friendship, botInstance) => {
  const { Friendship } = botInstance

  let logMsg = 'received `friend` event from ' + friendship.contact().name()

  Utils.logger.info(logMsg)

  switch (friendship.type()) {
    // 收到好友邀请
    case Friendship.Type.Receive:
      try {
        const res = await sendMsg2RecvdApi(
          new FriendshipMsg({
            name: friendship.contact().name(),
            hello: friendship.hello()
          })
        )

        await handleResSendMsg({
          res,
          type: MSG_TYPE_ENUM.CUSTOM_FRIENDSHIP,
          friendship
        })
      } catch (error) {
        Utils.logger.error('尝试回应好友邀请时发生错误:', error)
      }

      break

    // 申请的好友通过验证
    case Friendship.Type.Confirm:
      Utils.logger.info(
        'friend ship confirmed with ' + friendship.contact().name()
      )
      break
  }
}

module.exports = {
  onRecvdFriendship
}
