# docker-wechat-roomBot

基于 [wechaty](https://github.com/wechaty/wechaty#readme) 和 [Express](https://github.com/expressjs/express) 开发

在微信群和webhook机器人之间架一座桥梁，从此微信里也可以有自己的webhook机器人了，快用它集成到自己的自动化工作流中（ 推荐 [n8n](https://github.com/n8n-io/n8n)）吧

![Docker Image Version (latest semver)](https://img.shields.io/docker/v/dannicool/docker-wechat-roombot) ![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/danni-cool/docker-wechat-roomBot/docker-build.yml)  ![Docker Pulls](https://img.shields.io/docker/pulls/dannicool/docker-wechat-roombot)

[view this project on docker hub :)](https://hub.docker.com/repository/docker/dannicool/docker-wechat-roombot/general)

# 一、开始

## 1. 拉取镜像

```bash
docker pull dannicool/docker-wechat-roombot
```

## 2. 启动容器(后台常驻)

```bash
 docker run -d \
--name wcRoomBot \
-p 3001:3001 \
dannicool/docker-wechat-roombot
```

## 3. 登录wx

```bash
docker logs -f wcRoomBot
```

找到二维码登录地址，图下 https://[url] 部分，浏览器访问，扫码登录wx

![](https://cdn.jsdelivr.net/gh/danni-cool/blog.danni.cool/cdn/image/docker-login-wechat.png)

# 二、推送消息

## webhook格式

- Url：<http://localhost:3001/webhook/roomMsg>
- Methods: `POST`
- ContentType: `application/json`
- Body:
  - to:  "Test Group"
  - type: "text"
  - content: "都别臊皮了，学习吧。🤡"

### Body 参数说明

| 参数 |  说明 | 数据类型 | 可选值 | 可否为空 | 例子 |
|--|--|--|--|--|--|
| to | 群名 | String | any |  N | Test Group |
| type | 发送消息类型 | String | <ul><li>text</li><li>img</li></ul>| N | text |
| content | 发送的消息 | String | any | N | 这是一条群消息 |

> 如果希望发多张图，type 指定为 img，content 里填 url 以英文逗号分隔

# Changelog

## 1.0.1 (2023-09-19)

### Features

- 🎸 增加推送支持多图推送 ([9c659ad](https://github.com/danni-cool/docker-wechat-roomBot/commit/9c659ad15e1365194df1a02560ef4307ed2ecae5))
