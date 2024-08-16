import httpService from '@wechatbot-webhook/core'
import wxProvider from './impl'

httpService.use({provider: wxProvider}).start()