/** @typedef { import('wechaty').Message | import('wechaty').Room | import('wechaty/impls').ContactInterface} msgInstanceType */

/** @typedef { import('wechaty').Message | import('@src/utils/msg').CommonMsg & {isSystemEvent: boolean} }extendedMsg */

/** @typedef {{ key: 'to' |'isRoom' | 'type' | 'data' | 'content' | 'data.type' | 'data.content', val: any, required: boolean, type: string | string[], enum?: Array<string|number>, unValidReason: string }} pushMsgValidPayload */

/** @typedef {File & {convertName:string}} payloadFormFile */
