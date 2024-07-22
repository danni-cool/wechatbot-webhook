declare namespace NodeJS {
  interface ProcessEnv {
    /** 服务启动的端口 */
    PORT: string | number
    /** 运行时提示的消息等级（默认info，想有更详细的日志，可以指定为debug) */
    LOG_LEVEL: 'info' | 'debug'
    /** 如果不希望登录一次后就记住当前账号，想每次都扫码登陆(仅对web协议生效）*/
    DISABLE_AUTO_LOGIN: 'true' | 'false'
    /** RECVD_MSG_API 是否接收来自自己发的消息 */
    ACCEPT_RECVD_MSG_MYSELF: 'true' | 'false'
    /** 如果想自己处理收到消息的逻辑，在下面填上你的API地址, 默认为空 */
    LOCAL_RECVD_MSG_API: string
    /** 登录地址Token访问地址： http://localhost:3001/login?token=[LOCAL_LOGIN_API_TOKEN] */
    LOCAL_LOGIN_API_TOKEN: string
    // 添加其他环境变量
  }
}
