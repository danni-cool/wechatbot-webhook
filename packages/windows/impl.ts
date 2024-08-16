import { Wcferry } from '@wcferry/core'
import { UserInfo } from '@wcferry/core'
import {
  contactType,
  msgText,
  contactCoreType,
  wxProviderInterface
} from '@/utils/types'

export default class WinProviderImpl implements wxProviderInterface {
  public config: {
    host: string
    port: number
    recvPyq: boolean
  }
  public version: string
  public selfInfo: contactType | null
  public contactList: contactType[] | []

  private client: Wcferry | null
  private destroyFn: (() => void) | null

  constructor({ host = '127.0.0.1', port = 10086, recvPyq = false }) {
    this.client = null
    this.config = { host, port, recvPyq }
    this.selfInfo = null
    this.contactList = []
    this.version = ''
    this.destroyFn = null
  }

  get getSelfInfo() {
    return this.selfInfo
  }

  get isLogin() {
    return this.client?.isLogin() || false
  }

  get isInitd() {
    return this.client?.connected || false
  }

  setSelfInfo(data: UserInfo) {
    this.selfInfo = {
      uuid: data.uuid,
      wxid: '',
      name: '',
      remark: '',
      gentle: '未知',
      phone: '',
      home: '',
      age: 0,
      avatar: ''
    }
  }

  run() {
    const { host, port, recvPyq } = this.config
    this.client = new Wcferry({ host, port, recvPyq })

    this.client.start()

    this.isLogin && this.setSelfInfo(this.client.getUserInfo())

    this.destroyFn = this.client.on((msg) => {
      console.log('received message:', msg)
    })

    return this.isInitd
  }

  restart() {
    this.destroy()
    this.run()
  }

  destroy(): void {
    this.destroyFn?.()
    //TODO: 更新联系人列表等
  }

  on(key: 'message', callback) {}

  async sendTextMsg(data: msgText) {
    // data.atList
    return
  }

  async sendFile() {}
}
