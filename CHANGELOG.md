# [1.4.0](https://github.com/danni-cool/docker-wechatbot-webhook/compare/v1.3.0...v1.4.0) (2023-10-09)


### Bug Fixes

* 🐛 修复登录Api user 值为undefined的问题 ([9711eb8](https://github.com/danni-cool/docker-wechatbot-webhook/commit/9711eb8da3a1cb4fa4dfd23792bb989013040a5b))


### Features

* 🎸 增加登录后可能登出的时间上报 ([ef3539f](https://github.com/danni-cool/docker-wechatbot-webhook/commit/ef3539f6652124434d54d86a67796acee307ca28))
* 🎸 推消息api支持文件和文件Url ([350af6a](https://github.com/danni-cool/docker-wechatbot-webhook/commit/350af6a3a8591163f1d2fd8a33c2f56769b215b5))


### Performance Improvements

* ⚡️ 参数错误时，校验优化，更正项目地址 ([dafafea](https://github.com/danni-cool/docker-wechatbot-webhook/commit/dafafea1519b790c4db1eafe43f1193e78b2aea7))
* ⚡️ 精简无用代码&增加运行调试模式 ([e3d8bad](https://github.com/danni-cool/docker-wechatbot-webhook/commit/e3d8bad6427105a6f27d246a63840888547c0700))

# [1.3.1](https://github.com/danni-cool/docker-wechatbot-webhook/compare/v1.3.0...v1.3.1) (2023-10-09)


### Performance Improvements

* ⚡️ 参数错误时，校验优化，更正项目地址 ([dafafea](https://github.com/danni-cool/docker-wechatbot-webhook/commit/dafafea1519b790c4db1eafe43f1193e78b2aea7))



# [1.3.0](https://github.com/danni-cool/docker-wechatbot-webhook/compare/v1.2.0...v1.3.0) (2023-10-08)


### Features

* 🎸 login事件也增加通知 ([cb56a4e](https://github.com/danni-cool/docker-wechatbot-webhook/commit/cb56a4e1e44ccaefec1c03a277c1e496321f7098))



# [1.2.0](https://github.com/danni-cool/docker-wechatbot-webhook/compare/v1.1.3...v1.2.0) (2023-10-08)


### Features

* 🎸 增加checklogin api接口和token生成机制 ([1b64d1e](https://github.com/danni-cool/docker-wechatbot-webhook/commit/1b64d1e16eeb2c42697efb2137939d56ab605836))
* 🎸 支持掉线或者异常时的通知机制 ([6008271](https://github.com/danni-cool/docker-wechatbot-webhook/commit/6008271c983df75bbbdf326b3958f9264c708459)), closes [#9](https://github.com/danni-cool/docker-wechatbot-webhook/issues/9)



## [1.1.3](https://github.com/danni-cool/docker-wechatbot-webhook/compare/v1.1.2...v1.1.3) (2023-09-29)


### Features

* 🎸 增加对入参的严格校验 ([5537a95](https://github.com/danni-cool/docker-wechatbot-webhook/commit/5537a955fd1b747ef3c486beffac89b0a1c3d304))
* 🎸 支持收消息钩子，以及文档优化 ([3638ff7](https://github.com/danni-cool/docker-wechatbot-webhook/commit/3638ff7feb9de02fab5dfe4d90f7079bc884a387))


### Reverts

* Revert "[skip ci]: change cdn address" ([0b0ec7a](https://github.com/danni-cool/docker-wechatbot-webhook/commit/0b0ec7a32ad1f26498b6d7bd8b390d8260f8d69e))



## [1.1.2](https://github.com/danni-cool/docker-wechatbot-webhook/compare/v1.1.1...v1.1.2) (2023-09-22)


### Features

* 🎸 支持webhook推送到个人，文档优化，workflow优化 ([87bbb5e](https://github.com/danni-cool/docker-wechatbot-webhook/commit/87bbb5e42c48745b3a8a3001817c6391f3af9387)), closes [#1](https://github.com/danni-cool/docker-wechatbot-webhook/issues/1)

* 🧨 docker 项目地址修改 和 api修改

## 1.1.1 (2023-09-21)


### Bug Fixes

* 🐛 修复发送图片来自cloudflare 托管的url 返回 http状态码301图片发送不成功的问题 ([44550a0](https://github.com/danni-cool/docker-wechat-roomBot/commit/44550a030273a6dcc1b8b296ec8fcdf4f9202849))



## 1.1.0 (2023-09-20)


### Features

* 🎸 增加了参数校验，docker tag 改为latest，更新部分注释 ([61ddd8a](https://github.com/danni-cool/docker-wechat-roomBot/commit/61ddd8a163ac37f8383fe62c757724f393f87e45))



## 1.0.1 (2023-09-19)


### Features

* 🎸 增加推送支持多图推送 ([9c659ad](https://github.com/danni-cool/docker-wechat-roomBot/commit/9c659ad15e1365194df1a02560ef4307ed2ecae5))
