<div align="center">
<img src="https://cdn.jsdelivr.net/gh/danni-cool/danni-cool@cdn/image/wechatbot-webhook.png" width="500" height="251"/>

简单易懂、开箱即用的 Wechaty 应用层项目，实现了一个支持消息收发的微信 webhook 机器人，当 http 调用和二次开发亦可，二次开发请fork

![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/danni-cool/wechatbot-webhook/release.yml) ![Docker Pulls](https://img.shields.io/docker/pulls/dannicool/docker-wechatbot-webhook) ![GitHub release (with filter)](https://img.shields.io/github/v/release/danni-cool/wechatbot-webhook)
<a href="https://discord.gg/B5FFP3hT"><img src="https://img.shields.io/discord/1165844612473172088?logo=Discord&link=https%3A%2F%2Fdiscord.gg%2FB5FFP3hT" /></a>


[view this project on docker hub :)](https://hub.docker.com/repository/docker/dannicool/docker-wechatbot-webhook/general)

📝 [FAQ](https://github.com/danni-cool/wechatbot-webhook/issues/72)
</div>

## 💼 功能 Feature

| 功能 | 推送消息 | 接收消息 |
--|--|--
| 支持的功能 | <ul><li>✅ 发送文字</li><li>✅ 发送图片</li><li>✅ 发送文件</li></ul> | <ul><li>✅ 文字</li><li>✅ 链接卡片(公众号推文链接)</li><li>✅ 图片</li><li>✅ 视频</li><li>✅ 附件</li> <li>✅ 语音</li></ul> |

## 🚀 一分钟 Demo

### 1. 运行
```bash
npx wechatbot-webhook

# 除非掉线，默认记住上次登录，换帐号请运行以下命令
npx wechatbot-webhook -f
```

### 2. 扫码登录

![](https://cdn.jsdelivr.net/gh/danni-cool/danni-cool@cdn/image/Jietu20231224-170732.gif)

### 3. 使用 http 请求给指定用户发消息

新开个终端试试以下 curl

```bash
curl --location 'http://localhost:3001/webhook/msg' \
--header 'Content-Type: application/json' \
--data '{
    "to": "测试昵称",
    "type": "text",
    "content": "Hello World!"
}'
```

## 🛠️ API

### 1. 推消息

- Url：<http://localhost:3001/webhook/msg>
- Methods: `POST`

#### Case1. 发文字或文件(外链)

- ContentType: `application/json`
- Body: 格式见下面表格

> json 请求发送文件只支持外链

| 参数 |  说明 | 数据类型 | 默认值 | 可否为空 | 可选参数 |
| -- | -- | -- | -- | -- | -- |
| to | **消息接收方**，传入`String` 默认是发给昵称（群名同理）, 传入`Object` 结构支持发给备注过的人，比如：`{alias: '备注名'}`，群名不支持备注名 | `String` `Object` | -  |  Y  | - |
| isRoom | **是否发的群消息**，这个参数决定了找人的时候找的是群还是人，因为昵称其实和群名相同在技术处理上 | `Boolean` | `false`  | Y  |  `true`  `false`  |
| type | **消息类型**，消息不支持自动拆分，请手动调多次。| `String`  | - | N | `text`  `fileUrl` | 支持 **文字** 和 **文件**，  |
| content | **消息内容**，如果希望发多个Url并解析，type 指定为 fileUrl 同时，content 里填 url 以英文逗号分隔 | `String` | - | N | - |

#### Example（curl）

##### Curl (发文字)

```bash
curl --location --request POST 'http://localhost:3001/webhook/msg' \
--header 'Content-Type: application/json' \
--data-raw '{
    "to": "testUser",
    "type": "text",
    "content": "Hello World!"
}'
```

##### Curl（发文件，解析url）

```bash
curl --location --request POST 'http://localhost:3001/webhook/msg' \
--header 'Content-Type: application/json' \
--data-raw '{
    "to": "testGroup",
    "type": "fileUrl",
    "content": "https://samplelib.com/lib/preview/mp3/sample-3s.mp3",
    "isRoom": true
}'
```

#### Case2. 读文件发送

- ContentType: `multipart/form-data`
- FormData: 格式见下面表格

| 参数    | 说明                                                                             | 数据类型 | 默认值 | 可否为空 | 可选值  |
| ------- | -------------------------------------------------------------------------------- | -------- | ------ | -------- | ------- |
| to      | 消息接收方，传入`String` 默认是发给昵称（群名同理）, 传入 Json String 结构支持发给备注过的人，比如："{alias: '备注名'}"，群名不支持备注名称                                       | `String` | -      | N        | -       |
| isRoom  | **是否发的群消息**，formData纯文本只能使用 `String` 类型，`1`代表是，`0`代表否， | `String` | `0`    | Y        | `1` `0` |
| content | **文件**，本地文件一次只能发一个，多个文件手动调用多次                           | `Binary` | -      | N        | -       |

##### Curl

```bash
curl --location --request POST 'http://localhost:3001/webhook/msg' \
--form 'to=testGroup' \
--form content=@"$HOME/demo.jpg" \
--form 'isRoom=1'
```

## 🔍 For More Detail

更多 API 和部署等，请参阅 [项目源码](https://github.com/danni-cool/wechatbot-webhook/)