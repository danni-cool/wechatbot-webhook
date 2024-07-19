import { msgText, msgFile, msgRes, contactType, contactCoreType } from '.'

export default interface wxProviderInterface {
  /** 显示当前provider的版本号 */
  version: string
  /** 个人信息 */
  selfInfo: contactType | null
  /** 是否已经登录 */
  get isLogin(): boolean
  /** 是否初始化完成（比如windows协议是否连上rpc） */
  get isInitd(): boolean
  setSelfInfo(data: any): void
  /** 启动应用 */
  run(): boolean
  /** 发送文字消息 */
  sendTextMsg(data: msgText): Promise<undefined | boolean>
  /** 发送文件 */
  sendFile(data: msgFile): Promise<undefined | boolean>
  /** 监听消息 */
  on(event: 'message', callback: (data: msgRes) => void): void
}
