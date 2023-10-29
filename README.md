<div align="center">
<img src="https://cdn.jsdelivr.net/gh/danni-cool/danni-cool@cdn/image/wechatbot-webhook.png" width="500" height="251"/>

用 http 请求即可给微信发消息，集成了[Wechaty](https://github.com/wechaty/wechaty)大部分消息功能， 快用它集成到自己的自动化工作流中吧

![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/danni-cool/docker-wechatbot-webhook/release.yml) ![Docker Pulls](https://img.shields.io/docker/pulls/dannicool/docker-wechatbot-webhook) ![GitHub release (with filter)](https://img.shields.io/github/v/release/danni-cool/docker-wechatbot-webhook)

[view this project on docker hub :)](https://hub.docker.com/repository/docker/dannicool/docker-wechatbot-webhook/general)

✅[Todo](https://github.com/danni-cool/docker-wechatbot-webhook/issues/11) & 💬[Discussion(Discord)](https://discord.gg/jRX5F2Km)

> 项目基于web协议，已知登录几天会掉，需要重新登录。这是网页微信风控的问题。但是网页版相对轻量，仍然适合调试学习使用，有兴趣的可以关注windows分支

</div>

## 🚀 启动

#### 拉取镜像

```bash
docker pull dannicool/docker-wechatbot-webhook
```

#### 启动容器

该方法会在后台启动一个 **只能给微信推消息** 的容器

```bash
docker run -d \
--name wxBotWebhook \
-p 3001:3001 \
dannicool/docker-wechatbot-webhook
```

#### 可选参数

> Tips：需要增加参数使用 -e，多行用 \ 隔开，例如 -e  RECVD_MSG_API="<https://example.com/your/url>" \

| 功能 | 环境变量 | 案例 | 备注 |
|--|--|--|--|
|  收消息 |   RECVD_MSG_API  |   RECVD_MSG_API="<https://example.com/your/url>"   |  如果想自己处理收到消息的逻辑，比如根据消息联动，填上你的处理逻辑 url，该行可以省略 |
| 自定义登录 API token | LOGIN_API_TOKEN | LOGIN_API_TOKEN=abcdefg123 | 你也可以自定义一个自己的登录令牌，不配置的话，默认会生成一个 |

## 👨🏻‍💻 登录wx

1.以下只展示 docker 启动，本地调试可以直接在控制台找到链接

```bash
docker logs -f wxBotWebhook
```

2.找到二维码登录地址，图下 url 部分，浏览器访问，扫码登录wx

<https://localhost:3001/login?token=YOUR_PERSONAL_TOKEN>

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
| type | **消息类型**，消息不支持自动拆分，请手动调多次，发送的文件 Url 在微信里长啥样，是文件后缀决定的。| `String`  | - | N | `text`  `fileUrl` | 支持 **文字** 和 **文件**，  |
| content | **消息内容**，如果希望发多个Url并解析，type 指定为 fileUrl 同时，content 里填 url 以英文逗号分隔 | `String` | - | N | - |

#### Example（curl）

##### Curl (发文字)

```bash
curl --location --request POST 'http://localhost:3001/webhook/msg' \
--header 'Content-Type: application/json' \
--data-raw '{
    "to": "testUser",
    "type": "text",
    "content": "Hello World!",
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
| to      | **会话名**，发群消息填群名，发给个人填昵称                                       | `String` | -      | N        | -       |
| isRoom  | **是否发的群消息**，formData纯文本只能使用 `String` 类型，`1`代表是，`0`代表否， | `String` | `0`    | Y        | `1` `0` |
| content | **文件**，本地文件一次只能发一个，多个文件手动调用多次                           | `Binary` | -      | N        | -       |

##### Curl

```bash
curl --location --request POST 'http://localhost:3001/webhook/msg' \
--form 'to=testGroup' \
--form content=@"$HOME/demo.jpg" \
--form 'isRoom=1'
```

### 2. 收消息

> 收消息接口使用 form 表单传递参数

入参：

- Methods: `POST`
- ContentType: `multipart/form-data`
- Form格式如下

| formData      | 说明                                                                                                                                                                                                                                                                      | 数据类型          | 可选值                  | 示例                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ----------------------- | ------------------------------------------------ |
| type          | <div>支持的类型</div><ul><li>✅ 文字(text)</li><li>✅ 链接卡片(urlLink)</li><li>✅ 图片(file)</li><li>✅ 视频(file)</li><li>✅ 附件(file)</li> <li>✅ 语音(file)</li></ul> refer: [wechaty类型支持列表](https://wechaty.js.org/docs/api/message#messagetype--messagetype) | `String`          | `text` `file` `urlLink` | -                                                |
| content       | 传输的内容, 文本或传输的文件共用这个字段，结构映射请看示例                                                                                                                                                                                                                | `String` `Binary` |                         | [示例](docs/recvdApi.example.md#formdatacontent) |
| source        | 消息的相关发送方数据, JSON String                                                                                                                                                                                                                                         | `String`          |                         | [示例](docs/recvdApi.example.md#formdatasource)  |
| isMentioned   | 该消息是@我的消息[#38](https://github.com/danni-cool/docker-wechatbot-webhook/issues/38)                                                                                                                                                                                  | `String`          | `1` `0`                 | -                                                |
| isSystemEvent | 是否是来自系统消息事件（比如上线，掉线、异常事件）                                                                                                                                                                                                                        | `String`          | `1` `0`                 | -                                                |

### 3. 登录APi

1. 在异常或者掉线事件触发后，通知你配置的 `RECVD_MSG_API`，
2. 在收到通知后，访问登录 Api 扫码登录 <http://localhost:3001/login?token=YOUR_PERSONAL_TOKEN。>

#### 自定义token

token 初次启动项目会自动生成，你也可以配置一个简单好记的token， 如果都配置，docker 配置将覆盖本地配置

1. docker 启动，参数为 -e LOGIN_API_TOKEN="YOUR_PERSONAL_TOKEN"
2. `.env` 文件中，配置 LOCAL_LOGIN_API_TOKEN=YOUR_PERSONAL_TOKEN

| API 路径    | Query Params | Methods | 描述                                                                          |
| ----------- | ------------ | ------- | ----------------------------------------------------------------------------- |
| /login      | token        | `GET`   | 登录成功，返回及当前用户。登录态掉了，跳转最新的登录二维码                    |
| /loginCheck | token        | `GET`   | 获取登录状态 API，始终返回 json 格式，登录二维码在登录失败会放在 `message` 中 |

##### /loginCheck 返回体

| JSON    | 说明                                      | 数据类型  | 可选值           |
| ------- | ----------------------------------------- | --------- | ---------------- |
| success | 登录成功与否                              | `Boolean` | `true` / `false` |
| message | 当前登录用户名，登录失败将返回扫码登录URL | `String`  |                  |

## 关于包管理器

从 npm 迁移至 pnpm，本地开发可以安装 pnpm 环境，建议 node 版本 16.13.1 以上，[参考链接](https://pnpm.io/zh/installation)

> 如果你是 MacOS，建议使用 Homebrew 安装

## ⏫ 更新日志

更新内容参见 [CHANGELOG](https://github.com/danni-cool/docker-wechat-roomBot/blob/main/CHANGELOG.md)
