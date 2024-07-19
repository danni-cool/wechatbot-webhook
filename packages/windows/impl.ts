import { Wcferry } from '@wcferry/core'
import wxProviderInterface from '@/utils/types/provider-define'
import { contactType, msgText, contactCoreType } from '@/utils/types'

export default class WinProviderImpl implements wxProviderInterface {
  public config: { 
    host: string 
    port: number, 
    recvPyq: boolean 
  }
  public version: string
  public selfInfo: contactType | null
  public contactList: contactType[] | []

  private client: Wcferry | null 

  constructor({ host = '127.0.0.1', port = 10086, recvPyq = false }) {

    this.client = null
    this.config = { host, port, recvPyq }
    this.selfInfo = null
    this.contactList = []
    this.version = ''
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

  setSelfInfo(data:contactCoreType) {

    this.selfInfo = {
      uuid: data.uuid,
      wxid: '',
      name: '',
      remark: '',
      gentle: '男',
      phone: '',
      country: '',
      age: 0,
      avatar: ''
    }
  }

  run() {
    const { host, port, recvPyq } = this.config
    this.client = new Wcferry({ host, port, recvPyq })

    this.client.start()

    this.isLogin && this.setSelfInfo(this.client.getUserInfo())

    const off = this.client.on((msg) => {
      console.log('received message:', msg)
    })

    return this.isInitd
  }

  async sendTextMsg(data:msgText) {
    data.atList
  }

  async sendFile() {}
}
