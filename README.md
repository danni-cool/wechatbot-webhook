# docker-wechatbot-webhook

基于 [wechaty](https://github.com/wechaty/wechaty#readme) 和 [Express](https://github.com/expressjs/express) 开发

在微信和webhook机器人之间架一座桥梁，从此微信里也可以有自己的webhook机器人了，快用它集成到自己的自动化工作流中（ 推荐 [n8n](https://github.com/n8n-io/n8n)）吧

![Docker Image Version (latest semver)](https://img.shields.io/docker/v/dannicool/docker-wechat-roombot) ![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/danni-cool/docker-wechat-roomBot/docker-build.yml)  ![Docker Pulls](https://img.shields.io/docker/pulls/dannicool/docker-wechat-roombot)

[view this project on docker hub :)](https://hub.docker.com/repository/docker/dannicool/docker-wechat-roombot/general)

## 一、开始

### 1. 本地调试

```
npm start
```

### 2. docker 启动

#### 拉取镜像

```bash
docker pull dannicool/docker-wechatbot-webhook
```

#### 启动容器(后台常驻)

```bash
 docker run -d \
--name wcRoomBot \
-p 3001:3001 \
dannicool/docker-wechatbot-webhook
```

#### 登录wx

```bash
docker logs -f wcRoomBot
```

找到二维码登录地址，图下 url 部分，浏览器访问，扫码登录wx

![](https://cdn.jsdelivr.net/gh/danni-cool/blog.danni.cool/cdn/image/docker-login-wechat.png)

## 二、给机器人推送消息

目前只支持 **文字** 和 **图片**，消息不支持图文自动拆分，请手动调多次

### webhook格式

- Url：<http://localhost:3001/webhook/msg>
- Methods: `POST`
- ContentType: `application/json`
- Body: 格式见下面表格

#### Body 参数说明

| 参数 |  说明 | 数据类型 | 默认值 | 可否为空 | 可选值 | 备注 |
|--|--|--|--|--|--|--|
| to | 会话名 | String |  |  N  |  | 发群消息填群名，发给个人填昵称 |
| isRoom | 是否发的群消息 | Boolean | false  | Y  |  <ul><li>true</li><li>false</li></ul>  |  |
| type | 发送消息类型 | String || N |  <ul><li>text</li><li>img</li></ul> |  |
| content | 发送的消息 | String |  | N |  | 如果希望发多张图，type 指定为 img 同时，content 里填 url 以英文逗号分隔 |

<!-- ## 三、机器人收到消息

> 目前收到消息也是使用webhook，逻辑单独放到外部流程去处理，如果觉得麻烦，想自己定制，欢迎 folk

### 1. 配置收消息 webhook

#### 本地调试

找到项目里的 .env 文件

```
PORT=3001
# 如果想自己处理收到消息的逻辑，在下面填上你的webhook地址, 默认为空
RECVD_MSG_WEBHOOK=https://xxxx.com/web-hook/roomBot-msg-received
```

### 2. 在群里 `@微信名` + 要说的话 

## 四、更新日志
-->

## 三、更新日志

更新内容参见 [CHANGELOG](https://github.com/danni-cool/docker-wechat-roomBot/blob/main/CHANGELOG.md)
