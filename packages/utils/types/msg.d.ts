import { RequireOne } from './utils'

type msgTextBase = {
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
  ATTACHMENT = 1,
  /** 语音 */
  VOICE = 2,
  /** 表情包 */
  EMOTION = 5,
  /** 图片 */
  PIC = 6,
  /** 文本 */
  TEXT = 7,
  /** 公众号链接 */
  MEDIA_URL = 14,
  /** 视频 */
  VIDEO = 15,
  /** 好友邀请 or 好友通过消息（自定义类型） */
  CUSTOM_FRIENDSHIP = 99,
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
