# docker-wechat-roomBot

基于 [wechaty](https://github.com/wechaty/wechaty#readme) 和 [Express](https://github.com/expressjs/express) 开发

在微信群和webhook机器人之间架一座桥梁，从此微信里也可以有自己的webhook机器人了，快用它集成到自己的自动化工作流中吧, 推荐 [n8n](https://github.com/n8n-io/n8n)

# API 说明
## 消息推送 webhook 推送到群消息 √

- Url：<http://localhost:3001/webhook/roomMsg>
- Methods: `POST`
- PayloadType: `application/json`
- Body:
  - to:  "Technical Committee 39" // 群名
  - type: "text" // 消息类型  text 纯文本 |  img 图片url,支持多张，英文逗号分割
  - content: "都别臊皮了，学习吧。🤡"

## 群消息的接收 TODO


# Changelog


# 1.1.0 (2023-09-19)


### Features

* 🎸 增加推送支持多图推送 ([9c659ad](https://github.com/danni-cool/docker-wechat-roomBot/commit/9c659ad15e1365194df1a02560ef4307ed2ecae5))


