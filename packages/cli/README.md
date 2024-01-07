<div align="center">
<img src="https://cdn.jsdelivr.net/gh/danni-cool/danni-cool@cdn/image/wechatbot-webhook.png" width="500" height="251"/>

![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/danni-cool/wechatbot-webhook/release.yml) ![npm dowloads](https://img.shields.io/npm/dm/wechatbot-webhook?label=npm/downloads)
 ![Docker Pulls](https://img.shields.io/docker/pulls/dannicool/docker-wechatbot-webhook) ![GitHub release (with filter)](https://img.shields.io/github/v/release/danni-cool/wechatbot-webhook)
<a href="https://discord.gg/qBF9VsBdc8"><img src="https://img.shields.io/discord/1165844612473172088?logo=Discord&link=https%3A%2F%2Fdiscord.gg%2FqBF9VsBdc8" /></a>


[🚢 Docker 镜像](https://hub.docker.com/repository/docker/dannicool/docker-wechatbot-webhook/general) | [🧑‍💻 Github](https://github.com/danni-cool/wechatbot-webhook)｜[🔍 FAQ](https://github.com/danni-cool/wechatbot-webhook/issues/72)
</div>

开箱即用的 Wechaty 应用层项目，实现了一个支持消息收发的微信 webhook 机器人

## ✨ Features

- **推送消息** (发送文字 / 图片 / 文件)
  - 💬 支持消息单条 / 多条 / 群发
  - 🌃 消息 url 解析成文件发送
  - 📁 支持读文件发送

- **接收消息**（文字 / 图片 / 语音 / 视频 / 文件 / 好友申请 / 公众号推文链接）
  - 🚗 单 API 收发消息（依赖收消息API，被动回复无需公网IP）
  - 🪧 登入掉线异常事件通知

- **其他功能**
  - 🤖 支持 非掉线自动登录
  - ✈️ 支持 带鉴权 api 接口获取登陆二维码
  - 支持 [n8n](https://n8n.io/) 低码平台丝滑接入（webhook 节点）
  - 🚢 支持 docker 部署，兼容 `arm64` 和 `amd64`
  - ✍️ 支持 日志文件导出

### 1. 安装

```bash
npm i wechatbot-webhook -g
```

### 2. 运行

```bash
wxbot
```

#### 参数

```bash
Options:
  -V, --version  output the version number
  -r, --reload   想重新扫码时加该参数，不加默认记住上次登录状态
  -e, --edit     打开 .wechat_bot_env 配置文件，可以填写上报消息API等
  -h, --help     display help for command
```

### 2. 扫码登录

![](https://cdn.jsdelivr.net/gh/danni-cool/danni-cool@cdn/image/Jietu20231224-170732.gif)

### 3. 使用 http 请求给指定用户发消息

新开个终端试试以下 curl，to字段值换成你要发送的昵称

```bash
curl --location 'http://localhost:3001/webhook/msg/v2' \
--header 'Content-Type: application/json' \
--data '{ "to": "测试昵称", data: { "content": "Hello World!" }}'
```

## 🛠️ API

[API Reference](https://github.com/danni-cool/docker-wechatbot-webhook#%EF%B8%8F-api)


## ⏫ 更新日志

更新内容参见 [CHANGELOG](https://github.com/danni-cool/docker-wechat-roomBot/blob/main/CHANGELOG.md)