import { RequireOne } from './utils'

type msgTextBase = {
  uuid: string
  /** 需要艾特人的集合,群聊时可用，数组里必须填 wxid */
  atList?: string[]
  /** 要发送的文字 */
  content: string
}

export type msgText = msgTextBase &
  RequireOne<
    {
      /** 微信wxid, 查找优先级 wxid > name > remark */
      wxid?: string
      /** 微信昵称or群名，查找优先级 wxid > name > remark */
      name?: string
      /** 备注（非群昵称备注），查找优先级 wxid > name > remark */
      remark?: string
    },
    'wxid' | 'name' | 'remark'
  >

type msgFileBase = {
  /** 需要艾特人的集合,群聊时可用，数组里必须填 wxid */
  atList?: string[]
  /** 要发送的文字 */
  content: File
}

export type msgFile = msgFileBase &
  RequireOne<
    {
      /** 微信wxid, 查找优先级 wxid > name > remark */
      wxid?: string
      /** 微信昵称or群名，查找优先级 wxid > name > remark */
      name?: string
      /** 备注（非群昵称备注），查找优先级 wxid > name > remark */
      remark?: string
    },
    'wxid' | 'name' | 'remark'
  >

/**
 * 所有消息类型枚举
 */
export enum msgType {
  /** 未知 */
  UNKNOWN = 0,
  /** 各种文件 */
  ATTACHMENT = 1, //共享实时位置、文件、转账、链接 wcferry 3
  /** 语音 */
  VOICE = 2, // 语音 wcferry 9999
  /** 表情包 */
  EMOTION = 5, // wcferry 62,
  /** 图片 */
  PIC = 6, // wcferry 34
  /** 文本 */
  TEXT = 7,
  /** 公众号链接 */
  MEDIA_URL = 14,
  /** 视频 */
  VIDEO = 15,
  /** 红包、系统的信息 */
  WECHAT_SYSTEM = 37,
  /** 撤回消息 */
  MSG_RECALL = 40,
  /** 位置 */
  POSITION = 42,
  /** 小视频 */
  MINI_VIDEO = 43,
  /** 石头剪刀布 */
  ROCK_PAPER_SCISSORS = 47,
  /** 好友确认 */
  FRIENDSHIP_CONFIRM = 48,
  /** 名片 */
  CALLING_CARD = 49,
  /** 系统提示 */
  SYSNOTICE = 52,
  /** 网络电话通知 */
  VOIPNOTIFY = 51,
  /** 好友邀请 or 好友通过消息（自定义类型） */
  // CUSTOM_FRIENDSHIP = 99,
  /** 可能是朋友的消息 */
  POSSIBLEFRIEND_MSG = 10000,

  /** 系统消息类型 */
  /** 登录事件 */
  SYSTEM_EVENT_LOGIN = 1000,
  /** 登出事件 */
  SYSTEM_EVENT_LOGOUT = 1001,
  /** 错误事件 */
  SYSTEM_EVENT_ERROR = 1002
  /** @desperate 推送通知事件 */
  // SYSTEM_EVENT_PUSH_NOTIFY = 1003
}

/**
 * 收到消息的返回体
 */
export type msgRes = {
  type: msgType
  data: any
}
