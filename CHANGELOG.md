## [2.4.0](https://github.com/danni-cool/docker-wechatbot-webhook/compare/v2.3.3...v2.4.0) (2023-12-22)


### Features

* 🎸 增加微信非登出状态，重启服务可以自动登录 ([#82](https://github.com/danni-cool/docker-wechatbot-webhook/issues/82)) ([839f866](https://github.com/danni-cool/docker-wechatbot-webhook/commit/839f8662bbafed6e36a990a9040462f373d04e78))


## [2.3.3](https://github.com/danni-cool/docker-wechatbot-webhook/compare/v2.3.2...v2.3.3) (2023-12-05)


### Bug Fixes

* 🐛 修复curl post文件时中文文件名的问题 ([85c1407](https://github.com/danni-cool/docker-wechatbot-webhook/commit/85c14078e89f2d131011fd804088cff178e01a72))


### Performance Improvements

* ⚡️ 移除大文件patch-file，指定 puppet-wechat4u 修复版本 ([dafce34](https://github.com/danni-cool/docker-wechatbot-webhook/commit/dafce3499e68d13d955e72df512cf2822b346510))


## [2.3.2](https://github.com/danni-cool/docker-wechatbot-webhook/compare/v2.3.1...v2.3.2) (2023-12-04)


### Bug Fixes

* 🐛 修复因为docker 打包和本地不一致问题 ([03cfc33](https://github.com/danni-cool/docker-wechatbot-webhook/commit/03cfc336c8e73acdd064495eb9c380b619c01f86))


## [2.3.1](https://github.com/danni-cool/docker-wechatbot-webhook/compare/v2.3.0...v2.3.1) (2023-12-04)

### Bug Fixes

* 修复0.5mb以上文件无法上传问题 ([7e3993c](https://github.com/danni-cool/docker-wechatbot-webhook/commit/7e3993ca1e13931e11089ff68e6498e1dff572c3))


## [2.3.0](https://github.com/danni-cool/docker-wechatbot-webhook/compare/v2.2.2...v2.3.0) (2023-10-29)

### Features

* 🎸 使用form表单发送本地文件支持备注名,移除发送json数据时提示不再支持的type类型 ([69f44e0](https://github.com/danni-cool/docker-wechatbot-webhook/commit/69f44e051aa71ac401179637e1cfe27f1f8c3ffe))

## [2.2.2](https://github.com/danni-cool/docker-wechatbot-webhook/compare/v2.2.1...v2.2.2) (2023-10-29)

### Bug Fixes

* 修复发送文件链接不带文件格式时无法正确解析的问题 & 移除 fetch 请求库 使用原生支持 ([b0b86b6](https://github.com/danni-cool/docker-wechatbot-webhook/commit/b0b86b623ff939bcaa4aced79a215103e7e7f1ee))


### Refactor

* 💡 优化代码 ([8f66412](https://github.com/danni-cool/docker-wechatbot-webhook/commit/8f664127e06d32bfc6eecef1c64e34041030b3a0))


### Performance Improvements

* docker 构建优化 ([efdb9e0](https://github.com/danni-cool/docker-wechatbot-webhook/commit/efdb9e086210cc1fac843001b5603cec797592b3))


## [2.2.1](https://github.com/danni-cool/docker-wechatbot-webhook/compare/v2.2.0...v2.2.1) (2023-10-23)

### Refactor

- 💡 移除patch补丁，更新依赖 ([aacc5a7](https://github.com/danni-cool/docker-wechatbot-webhook/commit/aacc5a7c152a1b0eec1533c6ef2a478b504cdae2))


## [2.2.0](https://github.com/danni-cool/docker-wechatbot-webhook/compare/v2.1.0...v2.2.0) (2023-10-22)

### Features

- 🎸 收消息增加@我的参数isMentioned，收到文件是unknown时优先使用buffer判断文件类型 ([10ec2b7](https://github.com/danni-cool/docker-wechatbot-webhook/commit/10ec2b7dc1a7a9aad96725a6451c0cd2f00ceae4))

## [2.1.0](https://github.com/danni-cool/docker-wechatbot-webhook/compare/v2.0.0...v2.1.0) (2023-10-13)

### Features

- 🎸 个人消息支持给送发备注名，收群消息source.room字段提供群成员更多信息（昵称、备注、id） ([d6ffd54](https://github.com/danni-cool/docker-wechatbot-webhook/commit/d6ffd54c8b6c95d59587192c1356f35a444ccbf7))

### Refactor

- 💡 删除srouce.room.payload.memberIdList字段 ([34dce0a](https://github.com/danni-cool/docker-wechatbot-webhook/commit/34dce0a4787223380da7775695b0ae8c19892a9a))
- 💡 移除推消息api对img类型的支持，请用fileUrl替换 ([df461d0](https://github.com/danni-cool/docker-wechatbot-webhook/commit/df461d075316b13883b18a4dd27db57f46075c0e))

## [2.2.0](https://github.com/danni-cool/docker-wechatbot-webhook/compare/v2.1.0...v2.2.0) (2023-10-22)


### Features

* 🎸 收消息增加@我的参数isMentioned，收到文件是unknown时优先使用buffer判断文件类型 ([10ec2b7](https://github.com/danni-cool/docker-wechatbot-webhook/commit/10ec2b7dc1a7a9aad96725a6451c0cd2f00ceae4))

## [2.0.0](https://github.com/danni-cool/docker-wechatbot-webhook/compare/v1.5.0...v2.0.0) (2023-10-11)

### ⚠ BREAKING CHANGES

- 🧨 收消息 api 现在支持语音、视频、附件，原只有文件和图片，上报type:img 已移除，会和历史不兼容

### Features

- 🎸 扩展收消息 api 支持的类型 ([4f4af46](https://github.com/danni-cool/docker-wechatbot-webhook/commit/4f4af46a4c6bd46107d61cb970d9b3c2222036c5))

## [1.5.0](https://github.com/danni-cool/docker-wechatbot-webhook/compare/v1.4.0...v1.5.0) (2023-10-11)

### Features

- 🎸 增加 /login api，并作为默认推荐登录api & 代码和文案优化 ([b3012e4](https://github.com/danni-cool/docker-wechatbot-webhook/commit/b3012e41bacf6369f4d6b017a8126919d199801d))

### Bug Fixes

- 🐛 login api redirect 301 改为 302，解决二维码失效问题 ([c9b6708](https://github.com/danni-cool/docker-wechatbot-webhook/commit/c9b670864dcc8c8b31b7116c722ed50f69fe2b81))

### Performance Improvements

- ⚡️ 不再需要两套登录api，合二为一 ([9968d66](https://github.com/danni-cool/docker-wechatbot-webhook/commit/9968d6689cbb4d68a7dbb08eda74a2b954e22455))

## [1.4.0](https://github.com/danni-cool/docker-wechatbot-webhook/compare/v1.3.0...v1.4.0) (2023-10-09)

### Bug Fixes

- 🐛 修复登录Api user 值为undefined的问题 ([9711eb8](https://github.com/danni-cool/docker-wechatbot-webhook/commit/9711eb8da3a1cb4fa4dfd23792bb989013040a5b))

### Features

- 🎸 增加登录后可能登出的时间上报 ([ef3539f](https://github.com/danni-cool/docker-wechatbot-webhook/commit/ef3539f6652124434d54d86a67796acee307ca28))
- 🎸 推消息api支持文件和文件Url ([350af6a](https://github.com/danni-cool/docker-wechatbot-webhook/commit/350af6a3a8591163f1d2fd8a33c2f56769b215b5))

### Performance Improvements

- ⚡️ 参数错误时，校验优化，更正项目地址 ([dafafea](https://github.com/danni-cool/docker-wechatbot-webhook/commit/dafafea1519b790c4db1eafe43f1193e78b2aea7))
- ⚡️ 精简无用代码&增加运行调试模式 ([e3d8bad](https://github.com/danni-cool/docker-wechatbot-webhook/commit/e3d8bad6427105a6f27d246a63840888547c0700))

## [1.3.1](https://github.com/danni-cool/docker-wechatbot-webhook/compare/v1.3.0...v1.3.1) (2023-10-09)

### Performance Improvements

- ⚡️ 参数错误时，校验优化，更正项目地址 ([dafafea](https://github.com/danni-cool/docker-wechatbot-webhook/commit/dafafea1519b790c4db1eafe43f1193e78b2aea7))

## [1.3.0](https://github.com/danni-cool/docker-wechatbot-webhook/compare/v1.2.0...v1.3.0) (2023-10-08)

### Features

- 🎸 login事件也增加通知 ([cb56a4e](https://github.com/danni-cool/docker-wechatbot-webhook/commit/cb56a4e1e44ccaefec1c03a277c1e496321f7098))

## [1.2.0](https://github.com/danni-cool/docker-wechatbot-webhook/compare/v1.1.3...v1.2.0) (2023-10-08)

### Features

- 🎸 增加checklogin api接口和token生成机制 ([1b64d1e](https://github.com/danni-cool/docker-wechatbot-webhook/commit/1b64d1e16eeb2c42697efb2137939d56ab605836))
- 🎸 支持掉线或者异常时的通知机制 ([6008271](https://github.com/danni-cool/docker-wechatbot-webhook/commit/6008271c983df75bbbdf326b3958f9264c708459)), closes [#9](https://github.com/danni-cool/docker-wechatbot-webhook/issues/9)

## [1.1.3](https://github.com/danni-cool/docker-wechatbot-webhook/compare/v1.1.2...v1.1.3) (2023-09-29)

### Features

- 🎸 增加对入参的严格校验 ([5537a95](https://github.com/danni-cool/docker-wechatbot-webhook/commit/5537a955fd1b747ef3c486beffac89b0a1c3d304))
- 🎸 支持收消息钩子，以及文档优化 ([3638ff7](https://github.com/danni-cool/docker-wechatbot-webhook/commit/3638ff7feb9de02fab5dfe4d90f7079bc884a387))

### Reverts

- Revert "[skip ci]: change cdn address" ([0b0ec7a](https://github.com/danni-cool/docker-wechatbot-webhook/commit/0b0ec7a32ad1f26498b6d7bd8b390d8260f8d69e))

## [1.1.2](https://github.com/danni-cool/docker-wechatbot-webhook/compare/v1.1.1...v1.1.2) (2023-09-22)

### Features

- 🎸 支持webhook推送到个人，文档优化，workflow优化 ([87bbb5e](https://github.com/danni-cool/docker-wechatbot-webhook/commit/87bbb5e42c48745b3a8a3001817c6391f3af9387)), closes [#1](https://github.com/danni-cool/docker-wechatbot-webhook/issues/1)

- 🧨 docker 项目地址修改 和 api修改

## 1.1.1 (2023-09-21)

### Bug Fixes

- 🐛 修复发送图片来自cloudflare 托管的url 返回 http状态码301图片发送不成功的问题 ([44550a0](https://github.com/danni-cool/docker-wechat-roomBot/commit/44550a030273a6dcc1b8b296ec8fcdf4f9202849))

## 1.1.0 (2023-09-20)

### Features

- 🎸 增加了参数校验，docker tag 改为latest，更新部分注释 ([61ddd8a](https://github.com/danni-cool/docker-wechat-roomBot/commit/61ddd8a163ac37f8383fe62c757724f393f87e45))

## 1.0.1 (2023-09-19)

### Features

- 🎸 增加推送支持多图推送 ([9c659ad](https://github.com/danni-cool/docker-wechat-roomBot/commit/9c659ad15e1365194df1a02560ef4307ed2ecae5))
