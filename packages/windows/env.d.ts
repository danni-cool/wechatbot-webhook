declare namespace NodeJS {
  interface ProcessEnv {
    /** 是否接受朋友圈消息 */
    RECVD_PYQ?: 'true' | 'false'
  }
}
