<div align="center">
<img src="./docs/Jietu20240506-220141%402x.jpg" width="500"/>

![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/danni-cool/wechatbot-webhook/release.yml) ![npm dowloads](https://img.shields.io/npm/dm/wechatbot-webhook?label=npm/downloads)
 ![Docker Pulls](https://img.shields.io/docker/pulls/dannicool/docker-wechatbot-webhook) ![GitHub release (with filter)](https://img.shields.io/github/v/release/danni-cool/wechatbot-webhook)
<a href="https://discord.gg/qBF9VsBdc8"><img src="https://img.shields.io/discord/1165844612473172088?logo=Discord&link=https%3A%2F%2Fdiscord.gg%qBF9VsBdc8" /></a>


[🚢 Docker 镜像](https://hub.docker.com/r/dannicool/docker-wechatbot-webhook/tags) | [📦 NPM包](https://www.npmjs.com/package/wechatbot-webhook)｜[🔍 FAQ](https://github.com/danni-cool/wechatbot-webhook/issues/72)

一个小小的微信机器人webhook，帮你抹平了很多自己开发的障碍，基于 http 请求
</div>


## ✨ Features

> [!Caution] 
> 当前版本基于web协议，其支持的功能有限，也不完美，除了bug修补和稳定性功能外，不再接收新的 feature request，后续精力会放到 windows 分支上，感兴趣的可以点个 watch 👀

| **功能** | web协议 | windows协议 |
| --- | --- | --- |
| 目前可用性 | ✅ | ❌ |
| 代码分支 | main | windows |
| Docker Tag | latest | windows |
| **<发送消息>** | ✅ 单条 / 多条 / 群发  | ✅ 单条 / 多条 / 群发 |
| 发文字 | ✅ | ✅ |
| 发图片 | ✅ 本地图片 / url图片解析 | ✅ 本地图片 / url图片解析 |
| 发视频（mp4) | ✅ 本地视频 / url视频解析 |  |
| 发文件 | ✅ 本地文件 / url文件解析 | ✅ 本地文件 / url文件解析 |
| **<接收消息>** | |  |
| 接收文字 | ✅ | ✅ |
| 接收语音 | ✅ |  |
| 接收图片 | ✅ |  |
| 接收视频 | ✅ |  |
| 接收文件 | ✅ |  |
| 接收公众号推文链接 | ✅ |  |
| 接收系统通知 | ✅ 上线通知 / 掉线通知 / 异常通知 |  |
| [头像获取](#33-获取静态资源接口) | ✅ |  |
| [快捷回复](#返回值-response-结构可选) | ✅  | ✅ |
| **<群管理>** |  |  |
| **<好友管理>** |  |  |
| 接收好友申请 | ✅ |  |
| 通过好友申请 | ✅ | |
| 获取联系人列表 | | |
| **<其他功能>** |  |  |
| 非掉线自动登录 | ✅ |  |
| API 鉴权 | ✅ | ✅ |
| [n8n](https://n8n.io/) 无缝接入 | ✅ |  |
| 支持docker部署 | ✅ arm64 / amd64 | ✅ amd64  |
| 日志文件导出 | ✅ | ✅  |

### ⚠️ 特别说明：

以上提到的功能 ✅ 为已实现，受限于微信协议限制，不同协议支持功能也是不同的，并不是所有功能都可以对接，例如：

  - 企业微信消息的收发 [#142](https://github.com/danni-cool/wechatbot-webhook/issues/142)
  - 发送语音消息 / 分享音乐 / 公众号等在 features 中未提到的功能

## 🚀 一分钟 Demo

### 1. 运行 & 扫码

```bash
npx wechatbot-webhook
```

> 除非掉线，默认记住上次登录，换帐号请运行以下命令 `npx wechatbot-webhook -r`

### 2. 复制推消息 api

从命令行中复制推消息api，例如 http://localhost:3001/webhook/msg/v2?token=[YOUR_PERSONAL_TOKEN]

![](https://cdn.jsdelivr.net/gh/danni-cool/danni-cool@cdn/image/wechatbot-demo.gif)

### 3. 使用以下结构发消息

新开个终端试试以下 curl，to、token 字段值换成你要值

```bash
curl --location 'http://localhost:3001/webhook/msg/v2?token=[YOUR_PERSONAL_TOKEN]' \
--header 'Content-Type: application/json' \
--data '{ "to": "测试昵称", data: { "content": "Hello World!" }}'
```

## 🔧 开发 or 调试

> [!IMPORTANT] 
> 包管理器迁移已至 pnpm，安装依赖请使用它，以支持一些不定时的临时包修补（patches）和加速依赖安装

# 📖  部署 / API

[wechatbot‐webhook 文档](https://github.com/danni-cool/wechatbot-webhook/wiki/wechatbot%E2%80%90webhook-%E6%96%87%E6%A1%A3)



## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=danni-cool/wechatbot-webhook&type=Date)](https://star-history.com/#danni-cool/wechatbot-webhook&Date)

## Contributors

Thanks to all our contributors!

<a href="https://github.com/danni-cool/wechatbot-webhook/graphs/contributors">![](https://contrib.rocks/image?repo=danni-cool/wechatbot-webhook)</a>

## ⏫ 更新日志

更新内容参见 [CHANGELOG](https://github.com/danni-cool/docker-wechat-roomBot/blob/main/CHANGELOG.md)
