module.exports = {
  /**
   * 推消息v2 发送消息主体结构校验规则
   * @param {pushMsgMainOpt} param0
   * @returns {{ key: 'to' | 'isRoom' | 'data', val: any, required: boolean, type: string|string[], unValidReason: string}[]}
   */
  pushMsgV2ParentRules: ({ to, isRoom, data }) => [
    {
      key: 'to',
      val: to,
      required: true,
      type: ['string', 'object'],
      unValidReason: ''
    },
    {
      key: 'isRoom',
      val: isRoom,
      required: false,
      type: 'boolean',
      unValidReason: ''
    },
    {
      key: 'data',
      val: data,
      required: true,
      type: ['object', 'array'],
      unValidReason: ''
    }
  ],
  /**
   * 推消息v2 发送消息data结构校验规则
   * @param {pushMsgUnitTypeOpt} param
   * @returns {{ key: 'type' | 'content', val: any, required: boolean, type: string, enum?: Array<string|number>, unValidReason: string}[]}
   */
  pushMsgV2ChildRules: ({ type, content }) => [
    {
      key: 'type',
      val: type,
      required: false,
      type: 'string',
      enum: ['text', 'fileUrl'],
      unValidReason: ''
    },
    {
      key: 'content',
      val: content,
      required: true,
      type: 'string',
      unValidReason: ''
    }
  ],

  /**
   * 推消息v1 发送文件校验规则
   * @param {pushFileMsgType} param0
   * @returns {{ key: 'to' | 'isRoom' | 'content', val: any, required: boolean, type: string|string[],enum?:(string|number)[], unValidReason: string}[]}
   */
  pushFileMsgRules: ({ to, isRoom, content }) => [
    {
      key: 'to',
      val: to,
      required: true,
      type: 'string',
      unValidReason: ''
    },
    {
      key: 'isRoom',
      val: isRoom,
      required: false,
      enum: ['1', '0'],
      type: 'string',
      unValidReason: ''
    },
    {
      key: 'content',
      val: content ?? 0,
      required: true,
      type: 'file',
      unValidReason: ''
    }
  ],

  /**
   * 推消息v1 发送消息校验规则
   * @param {pushMsgV1Type} param0
   * @returns {{ key: 'to' | 'type' | 'isRoom' | 'content', val: any, required: boolean, type: string|string[],enum?:(string|number)[], unValidReason: string}[]}
   */
  pushMsgV1Rules: ({ to, type, content, isRoom }) => [
    {
      key: 'to',
      val: to,
      required: true,
      type: ['string', 'object'],
      unValidReason: ''
    },
    {
      key: 'type',
      val: type,
      required: false,
      type: 'string',
      enum: ['text', 'fileUrl'],
      unValidReason: ''
    },
    {
      key: 'content',
      val: content,
      required: true,
      type: 'string',
      unValidReason: ''
    },
    {
      key: 'isRoom',
      val: isRoom,
      required: false,
      type: 'boolean',
      unValidReason: ''
    }
  ]
}
