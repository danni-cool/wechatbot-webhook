type msgInstanceType =
  | import('wechaty').Message
  | import('wechaty').Room
  | import('wechaty/impls').ContactInterface

type extendedMsg =
  | import('wechaty').Message
  | (import('@src/utils/msg').CommonMsg & { isSystemEvent: boolean })

type pushMsgValidPayload = {
  key:
    | 'to'
    | 'isRoom'
    | 'type'
    | 'data'
    | 'content'
    | 'data.type'
    | 'data.content'
  val: string | number
  required: boolean
  type: string | string[]
  enum?: Array<string | number>
  unValidReason: string
}

type payloadFormFile = File & { convertName: string }

type pushMsgUnitPayload = { type: 'text' | 'fileUrl'; content: string }

type pushMsgUnitTypeOpt = { type?: 'text' | 'fileUrl'; content: string }

type pushMsgMain = {
  to: string | { alias: string }
  isRoom: boolean
  data: pushMsgUnitPayload
}

type pushFileMsgType = {
  to: string | { alias: string }
  isRoom: boolean
  content: File
}

type pushMsgV1Type = {
  to: string | { alias: string }
  isRoom: boolean
  content: string
  type: 'text' | 'fileUrl'
}
