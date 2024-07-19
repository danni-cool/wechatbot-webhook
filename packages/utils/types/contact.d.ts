export type contactCoreType = {
  uuid: string
} & Record<string, any>

export type contactType = {
  /** 唯一动态id，为了避免两个人同一个昵称的情况，但是不要过于依赖该字段，每次启动程序都会变，是属于方便程序找到当前环境唯一用户增加 */
  uuid: string
  /** 联系人微信id，web微信没有该字段 */
  wxid: string
  /** 微信昵称 */
  name: string
  /** 微信备注 */
  remark: string
  /** 性别 */
  gentle: '男' | '女' | '未知'
  /** 手机号 */
  phone: string
  /** 地区 */
  home: string
  /** 年龄 */
  age: number
  /** 头像 （需要用户自己获取）*/
  avatar: string
}
