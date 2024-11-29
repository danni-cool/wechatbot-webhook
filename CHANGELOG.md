
## [2.8.2](https://github.com/danni-cool/wechatbot-webhook/compare/v2.8.1...v2.8.2) (2024-11-29)


### Bug Fixes

* 🐛 npm 包访问登陆网页空白 ([#272](https://github.com/danni-cool/wechatbot-webhook/issues/272)) ([2b3644f](https://github.com/danni-cool/wechatbot-webhook/commit/2b3644f742122b4292211cb4fa3e8e28a23cf628))


## [2.8.1](https://github.com/danni-cool/wechatbot-webhook/compare/v2.8.0...v2.8.1) (2024-11-29)


### Bug Fixes

* 🐛 修复登陆二维码依赖第三方网站被墙的问题 ([#269](https://github.com/danni-cool/wechatbot-webhook/issues/269)) ([2fe96d2](https://github.com/danni-cool/wechatbot-webhook/commit/2fe96d2b1199d78fda4c62f0da7e6aaf95c00f27))

## [2.8.0](https://github.com/danni-cool/wechatbot-webhook/compare/v2.7.0...v2.8.0) (2024-03-27)


### Features

* 🎸 增加静态资源获取接口，recvd_api 增加头像url地址 ([b85f7ba](https://github.com/danni-cool/wechatbot-webhook/commit/b85f7ba316df2fd64780da3f315c2c30a07c70e1))


## [2.7.0](https://github.com/danni-cool/wechatbot-webhook/compare/v2.6.1...v2.7.0) (2024-03-18)


### Features

* 🎸 发送文件url支持别名场景优化 ([#179](https://github.com/danni-cool/wechatbot-webhook/issues/179)) ([57307f2](https://github.com/danni-cool/wechatbot-webhook/commit/57307f2c6b4b9c233ce63acfccad5c9f6d4265e5)) close: [#186](https://github.com/danni-cool/wechatbot-webhook/issues/186) ([3ac950c](https://github.com/danni-cool/wechatbot-webhook/commit/3ac950cb06acc5dd57d57e35f72928ed3c5c8d51)) Thanks: @Cassius0924 


## [2.6.1](https://github.com/danni-cool/wechatbot-webhook/compare/v2.6.0...v2.6.1) (2024-03-02)


### Features

* 🎸 收消息API支持配置接受自己发的消息 close:[#159](https://github.com/danni-cool/wechatbot-webhook/issues/159)
* 🎸 增加 收消息API 对 unKnown类型消息的支持 [#165](https://github.com/danni-cool/wechatbot-webhook/issues/165)
* 🎸 增加服务稳定性，针对web协议连续登录和登出场景优化，登出后报错至多上报一次 recvd_api, 登出消息通知更加及时。错误类型单独定义 [#140](https://github.com/danni-cool/wechatbot-webhook/issues/140), [#160](https://github.com/danni-cool/wechatbot-webhook/issues/160)


## [2.6.0](https://github.com/danni-cool/wechatbot-webhook/compare/v2.5.3...v2.6.0) (2024-02-27)


### Features

* 🎸 增加全局路由鉴权 close:[#166](https://github.com/danni-cool/wechatbot-webhook/issues/166) ([875dfb3](https://github.com/danni-cool/wechatbot-webhook/commit/875dfb340da79467538bc2fd2c1713f77121a751))


## [2.5.3](https://github.com/danni-cool/wechatbot-webhook/compare/v2.5.2...v2.5.3) (2024-02-06)


### Bug Fixes

* 🐛 pnpm 运行命令不执行pre钩子。refer:[#146](https://github.com/danni-cool/wechatbot-webhook/issues/146) ([51ce80e](https://github.com/danni-cool/wechatbot-webhook/commit/51ce80ef8ba06606a7b1a1ea15c8494b1985db40))
* 🐛 修复friendship事件不上报recvdAPI的问题. close:[#155](https://github.com/danni-cool/wechatbot-webhook/issues/155) ([19b9148](https://github.com/danni-cool/wechatbot-webhook/commit/19b9148debf92115e57ea3239a86be2f1bf24c95))


## [2.5.2](https://github.com/danni-cool/wechatbot-webhook/compare/v2.5.1...v2.5.2) (2024-01-14)


### Bug Fixes

* 🐛 修复无重启登录后发送消息失败问题got more than 2 contacts close:[#60](https://github.com/danni-cool/wechatbot-webhook/issues/60) ([9d90ec1](https://github.com/danni-cool/wechatbot-webhook/commit/9d90ec1bd269ed588e8cfe17162af186bc87fe71))


### Performance Improvements

* ⚡️ 微信登出状态下不上报RecvdAPI Error级别错误 ([f45d42d](https://github.com/danni-cool/wechatbot-webhook/commit/f45d42d600d1849d79cd581e53b9e11b84b4eb49))


## [2.5.1](https://github.com/danni-cool/wechatbot-webhook/compare/v2.5.0...v2.5.1) (2024-01-11)


### Bug Fixes

* 🐛 修复收消息api解析文件名和类型问题。close:[#118](https://github.com/danni-cool/wechatbot-webhook/issues/118) ([cd1288e](https://github.com/danni-cool/wechatbot-webhook/commit/cd1288ea2935312675d06cafc1784848276a2b95))


## [2.5.0](https://github.com/danni-cool/wechatbot-webhook/compare/v2.4.2...v2.5.0) (2024-01-05)


### Features

* 🎸 增加log4js作为日志文件输出 ([17a84f8](https://github.com/danni-cool/wechatbot-webhook/commit/17a84f8aeab132979fc931e878b9a9381b8aff18))
* 🎸 增加健康检测接口/healthz替换/loginCheck, close:[#99](https://github.com/danni-cool/wechatbot-webhook/issues/99) ([55fb2ee](https://github.com/danni-cool/wechatbot-webhook/commit/55fb2ee2a3bbc343b29e5a2384f74ed84a24d000))
* 🎸 增加推消息的群发模式 ([d1e23fd](https://github.com/danni-cool/wechatbot-webhook/commit/d1e23fdae5769aeec28102655e672a601a3463fb))
* 🎸 推消息api支持单请求发多条消息 ([20b5983](https://github.com/danni-cool/wechatbot-webhook/commit/20b598373df74499a6ccfd336b5d8d5c867e0b64))


### Refactor

* 💡 http 服务使用hono替换express ([0444b22](https://github.com/danni-cool/wechatbot-webhook/commit/0444b22df0b362b7251f186a8252a76dc92d1d28))


### Performance Improvements

* ⚡️ 增加log日志输出稳定性 ([161c235](https://github.com/danni-cool/wechatbot-webhook/commit/161c235f79c4f7b01f22ce8df7efd3a1767fe418))
* ⚡️ 推消息api增加未登录校验 ([6ef54e3](https://github.com/danni-cool/wechatbot-webhook/commit/6ef54e3915d22686df8971eb1a80a897df40504f))


## [2.4.2](https://github.com/danni-cool/wechatbot-webhook/compare/v2.4.1...v2.4.2) (2023-12-29)


### Bug Fixes

* 🐛 修复因为未触发scan事件导致token未初始化可无鉴权访问/login的问题 close:[#102](https://github.com/danni-cool/wechatbot-webhook/issues/102) ([#103](https://github.com/danni-cool/wechatbot-webhook/issues/103)) ([2891e41](https://github.com/danni-cool/wechatbot-webhook/commit/2891e41416bc641aae3f7e372d318df2c9cfa6c1))


## [2.4.1](https://github.com/danni-cool/docker-wechatbot-webhook/compare/v2.4.0...v2.4.1) (2023-12-24)


### Bug Fixes

* 🐛 修复 puppet-wechat4u 重建登录失败问题 [#90](https://github.com/danni-cool/wechatbot-webhook/issues/90) ([c7fcaa6](https://github.com/danni-cool/wechatbot-webhook/commit/c7fcaa6fcaf396f1aed0f59975fd2dcac89d1798))


## [2.4.0](https://github.com/danni-cool/wechatbot-webhook/compare/v2.3.3...v2.4.0) (2023-12-22)


### Features

* 🎸 增加微信非登出状态，重启服务可以自动登录 ([#82](https://github.com/danni-cool/wechatbot-webhook/issues/82)) ([839f866](https://github.com/danni-cool/wechatbot-webhook/commit/839f8662bbafed6e36a990a9040462f373d04e78))


## [2.3.3](https://github.com/danni-cool/wechatbot-webhook/compare/v2.3.2...v2.3.3) (2023-12-05)


### Bug Fixes

* 🐛 修复curl post文件时中文文件名的问题 ([85c1407](https://github.com/danni-cool/wechatbot-webhook/commit/85c14078e89f2d131011fd804088cff178e01a72))


### Performance Improvements

* ⚡️ 移除大文件patch-file，指定 puppet-wechat4u 修复版本 ([dafce34](https://github.com/danni-cool/wechatbot-webhook/commit/dafce3499e68d13d955e72df512cf2822b346510))


## [2.3.2](https://github.com/danni-cool/wechatbot-webhook/compare/v2.3.1...v2.3.2) (2023-12-04)


### Bug Fixes

* 🐛 修复因为docker 打包和本地不一致问题 ([03cfc33](https://github.com/danni-cool/wechatbot-webhook/commit/03cfc336c8e73acdd064495eb9c380b619c01f86))


## [2.3.1](https://github.com/danni-cool/wechatbot-webhook/compare/v2.3.0...v2.3.1) (2023-12-04)

### Bug Fixes

* 修复0.5mb以上文件无法上传问题 ([7e3993c](https://github.com/danni-cool/wechatbot-webhook/commit/7e3993ca1e13931e11089ff68e6498e1dff572c3))


## [2.3.0](https://github.com/danni-cool/wechatbot-webhook/compare/v2.2.2...v2.3.0) (2023-10-29)

### Features

* 🎸 使用form表单发送本地文件支持备注名,移除发送json数据时提示不再支持的type类型 ([69f44e0](https://github.com/danni-cool/wechatbot-webhook/commit/69f44e051aa71ac401179637e1cfe27f1f8c3ffe))


## [2.2.2](https://github.com/danni-cool/wechatbot-webhook/compare/v2.2.1...v2.2.2) (2023-10-29)

### Bug Fixes

* 修复发送文件链接不带文件格式时无法正确解析的问题 & 移除 fetch 请求库 使用原生支持 ([b0b86b6](https://github.com/danni-cool/wechatbot-webhook/commit/b0b86b623ff939bcaa4aced79a215103e7e7f1ee))


### Refactor

* 💡 优化代码 ([8f66412](https://github.com/danni-cool/wechatbot-webhook/commit/8f664127e06d32bfc6eecef1c64e34041030b3a0))


### Performance Improvements

* docker 构建优化 ([efdb9e0](https://github.com/danni-cool/wechatbot-webhook/commit/efdb9e086210cc1fac843001b5603cec797592b3))


## [2.2.1](https://github.com/danni-cool/wechatbot-webhook/compare/v2.2.0...v2.2.1) (2023-10-23)

### Refactor

- 💡 移除patch补丁，更新依赖 ([aacc5a7](https://github.com/danni-cool/wechatbot-webhook/commit/aacc5a7c152a1b0eec1533c6ef2a478b504cdae2))


## [2.2.0](https://github.com/danni-cool/wechatbot-webhook/compare/v2.1.0...v2.2.0) (2023-10-22)

### Features

- 🎸 收消息增加@我的参数isMentioned，收到文件是unknown时优先使用buffer判断文件类型 ([10ec2b7](https://github.com/danni-cool/wechatbot-webhook/commit/10ec2b7dc1a7a9aad96725a6451c0cd2f00ceae4))

## [2.1.0](https://github.com/danni-cool/wechatbot-webhook/compare/v2.0.0...v2.1.0) (2023-10-13)

### Features

- 🎸 个人消息支持给送发备注名，收群消息source.room字段提供群成员更多信息（昵称、备注、id） ([d6ffd54](https://github.com/danni-cool/wechatbot-webhook/commit/d6ffd54c8b6c95d59587192c1356f35a444ccbf7))

### Refactor

- 💡 删除srouce.room.payload.memberIdList字段 ([34dce0a](https://github.com/danni-cool/wechatbot-webhook/commit/34dce0a4787223380da7775695b0ae8c19892a9a))
- 💡 移除推消息api对img类型的支持，请用fileUrl替换 ([df461d0](https://github.com/danni-cool/wechatbot-webhook/commit/df461d075316b13883b18a4dd27db57f46075c0e))

## [2.0.0](https://github.com/danni-cool/wechatbot-webhook/compare/v1.5.0...v2.0.0) (2023-10-11)

### ⚠ BREAKING CHANGES

- 🧨 收消息 api 现在支持语音、视频、附件，原只有文件和图片，上报type:img 已移除，会和历史不兼容

### Features

- 🎸 扩展收消息 api 支持的类型 ([4f4af46](https://github.com/danni-cool/wechatbot-webhook/commit/4f4af46a4c6bd46107d61cb970d9b3c2222036c5))

## [1.5.0](https://github.com/danni-cool/wechatbot-webhook/compare/v1.4.0...v1.5.0) (2023-10-11)

### Features

- 🎸 增加 /login api，并作为默认推荐登录api & 代码和文案优化 ([b3012e4](https://github.com/danni-cool/wechatbot-webhook/commit/b3012e41bacf6369f4d6b017a8126919d199801d))

### Bug Fixes

- 🐛 login api redirect 301 改为 302，解决二维码失效问题 ([c9b6708](https://github.com/danni-cool/wechatbot-webhook/commit/c9b670864dcc8c8b31b7116c722ed50f69fe2b81))

### Performance Improvements

- ⚡️ 不再需要两套登录api，合二为一 ([9968d66](https://github.com/danni-cool/wechatbot-webhook/commit/9968d6689cbb4d68a7dbb08eda74a2b954e22455))

## [1.4.0](https://github.com/danni-cool/wechatbot-webhook/compare/v1.3.0...v1.4.0) (2023-10-09)

### Bug Fixes

- 🐛 修复登录Api user 值为undefined的问题 ([9711eb8](https://github.com/danni-cool/wechatbot-webhook/commit/9711eb8da3a1cb4fa4dfd23792bb989013040a5b))

### Features

- 🎸 增加登录后可能登出的时间上报 ([ef3539f](https://github.com/danni-cool/wechatbot-webhook/commit/ef3539f6652124434d54d86a67796acee307ca28))
- 🎸 推消息api支持文件和文件Url ([350af6a](https://github.com/danni-cool/wechatbot-webhook/commit/350af6a3a8591163f1d2fd8a33c2f56769b215b5))

### Performance Improvements

- ⚡️ 参数错误时，校验优化，更正项目地址 ([dafafea](https://github.com/danni-cool/wechatbot-webhook/commit/dafafea1519b790c4db1eafe43f1193e78b2aea7))
- ⚡️ 精简无用代码&增加运行调试模式 ([e3d8bad](https://github.com/danni-cool/wechatbot-webhook/commit/e3d8bad6427105a6f27d246a63840888547c0700))

## [1.3.1](https://github.com/danni-cool/wechatbot-webhook/compare/v1.3.0...v1.3.1) (2023-10-09)

### Performance Improvements

- ⚡️ 参数错误时，校验优化，更正项目地址 ([dafafea](https://github.com/danni-cool/wechatbot-webhook/commit/dafafea1519b790c4db1eafe43f1193e78b2aea7))

## [1.3.0](https://github.com/danni-cool/wechatbot-webhook/compare/v1.2.0...v1.3.0) (2023-10-08)

### Features

- 🎸 login事件也增加通知 ([cb56a4e](https://github.com/danni-cool/wechatbot-webhook/commit/cb56a4e1e44ccaefec1c03a277c1e496321f7098))

## [1.2.0](https://github.com/danni-cool/wechatbot-webhook/compare/v1.1.3...v1.2.0) (2023-10-08)

### Features

- 🎸 增加checklogin api接口和token生成机制 ([1b64d1e](https://github.com/danni-cool/wechatbot-webhook/commit/1b64d1e16eeb2c42697efb2137939d56ab605836))
- 🎸 支持掉线或者异常时的通知机制 ([6008271](https://github.com/danni-cool/wechatbot-webhook/commit/6008271c983df75bbbdf326b3958f9264c708459)), closes [#9](https://github.com/danni-cool/wechatbot-webhook/issues/9)

## [1.1.3](https://github.com/danni-cool/wechatbot-webhook/compare/v1.1.2...v1.1.3) (2023-09-29)

### Features

- 🎸 增加对入参的严格校验 ([5537a95](https://github.com/danni-cool/wechatbot-webhook/commit/5537a955fd1b747ef3c486beffac89b0a1c3d304))
- 🎸 支持收消息钩子，以及文档优化 ([3638ff7](https://github.com/danni-cool/wechatbot-webhook/commit/3638ff7feb9de02fab5dfe4d90f7079bc884a387))

### Reverts

- Revert "[skip ci]: change cdn address" ([0b0ec7a](https://github.com/danni-cool/wechatbot-webhook/commit/0b0ec7a32ad1f26498b6d7bd8b390d8260f8d69e))

## [1.1.2](https://github.com/danni-cool/wechatbot-webhook/compare/v1.1.1...v1.1.2) (2023-09-22)

### Features

- 🎸 支持webhook推送到个人，文档优化，workflow优化 ([87bbb5e](https://github.com/danni-cool/wechatbot-webhook/commit/87bbb5e42c48745b3a8a3001817c6391f3af9387)), closes [#1](https://github.com/danni-cool/wechatbot-webhook/issues/1)

- 🧨 docker 项目地址修改 和 api修改

## 1.1.1 (2023-09-21)

### Bug Fixes

- 🐛 修复发送图片来自cloudflare 托管的url 返回 http状态码301图片发送不成功的问题 ([44550a0](https://github.com/danni-cool/wechatbot-webhook/commit/44550a030273a6dcc1b8b296ec8fcdf4f9202849))

## 1.1.0 (2023-09-20)

### Features

- 🎸 增加了参数校验，docker tag 改为latest，更新部分注释 ([61ddd8a](https://github.com/danni-cool/wechatbot-webhook/commit/61ddd8a163ac37f8383fe62c757724f393f87e45))

## 1.0.1 (2023-09-19)

### Features

- 🎸 增加推送支持多图推送 ([9c659ad](https://github.com/danni-cool/wechatbot-webhook/commit/9c659ad15e1365194df1a02560ef4307ed2ecae5))
