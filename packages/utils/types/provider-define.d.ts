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
  /** 启动应用, 连接服务，返回sdk初始化状态 */
  run(): boolean
  /** 重启应用, 重新登录或者更新所有联系人列表 */
  restart(): void
  /** 销毁应用，解绑事件等，断开连接，登出 */
  destroy(): void
  /** 发送文字消息 */
  sendTextMsg(data: msgText): Promise<undefined | boolean>
  /** 发送文件 */
  sendFile(data: msgFile): Promise<undefined | boolean>
  /** 监听消息 */
  on(event: 'message', callback: (data: msgRes) => void): this
}
