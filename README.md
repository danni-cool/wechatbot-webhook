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
| 支持的功能 | <ul><li>✅ 发送文字</li><li>✅ 发送图片</li><li>✅ 发送文件</li></ul> | <ul><li>✅ 文字</li><li>✅ 图片</li><li>✅ 视频</li><li>✅ 附件</li> <li>✅ 语音</li><li>✅ 添加好友邀请</li><li>✅ 链接卡片(公众号推文链接)</li></ul> |

## 🚀 一分钟 Demo

### 1. 运行

```bash
npx wechatbot-webhook
```

> 除非掉线，默认记住上次登录，换帐号请运行以下命令 `npx wechatbot-webhook -r`

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

## ⛰️ 部署 Deploy（推荐）

### Docker 部署

#### 1. 启动容器

```bash
docker run -d \
--name wxBotWebhook \
-p 3001:3001 \
dannicool/docker-wechatbot-webhook
```

#### 2. 登录

```bash
docker logs -f wxBotWebhook
```

找到二维码登录地址，图下 url 部分，浏览器访问，扫码登录wx

<https://localhost:3001/login?token=YOUR_PERSONAL_TOKEN>

#### Docker 可选参数

> Tips：需要增加参数使用 -e，多行用 \ 隔开，例如 -e  RECVD_MSG_API="<https://example.com/your/url>" \

| 功能 | 环境变量 | 案例 | 备注 |
|--|--|--|--|
|  收消息 |   RECVD_MSG_API  |   RECVD_MSG_API=<https://example.com/your/url>   |  如果想自己处理收到消息的逻辑，比如根据消息联动，填上你的处理逻辑 url，该行可以省略 |
| 禁用自动登录 | DISABLE_AUTO_LOGIN | DISABLE_AUTO_LOGIN=true |  非微信踢下线账号，可以依靠session免登, 如果想每次都扫码登陆，则增加该条配置 |
| 自定义登录 API token | LOGIN_API_TOKEN | LOGIN_API_TOKEN=abcdefg123 | 你也可以自定义一个自己的登录令牌，不配置的话，默认会生成一个 |

## 🛠️ API

### 1. 推消息 API

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

### 2. 收消息 API

> **快捷回复**：收消息API现在支持通过返回值实现快捷回复， https://github.com/danni-cool/wechatbot-webhook/issues/96, 无需再发起 post 请求，一个 API 搞定接受和回复

#### 请求体
  - Methods: `POST`
  - ContentType: `multipart/form-data`
  - Form格式如下

| formData      | 说明                                                                                                                                                                                                                                                                      | 数据类型          | 可选值                  | 示例                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ----------------------- | ------------------------------------------------ |
| type          | <div>支持的类型</div><ul><li>✅ 文字(text)</li><li>✅ 链接卡片(urlLink)</li><li>✅ 图片(file)</li><li>✅ 视频(file)</li><li>✅ 附件(file)</li> <li>✅ 语音(file)</li><li>✅ 添加好友邀请(friendship)</li></ul> close: [#10](https://github.com/danni-cool/wechatbot-webhook/issues/10) refer: [wechaty类型支持列表](https://wechaty.js.org/docs/api/message#messagetype--messagetype) | `String`          | `text` `file` `urlLink` `friendship` | -                                                |
| content       | 传输的内容, 文本或传输的文件共用这个字段，结构映射请看示例                                                                                                                                                                                                                | `String` `Binary` |                         | [示例](docs/recvdApi.example.md#formdatacontent) |
| source        | 消息的相关发送方数据, JSON String                                                                                                                                                                                                                                         | `String`          |                         | [示例](docs/recvdApi.example.md#formdatasource)  |
| isMentioned   | 该消息是@我的消息[#38](https://github.com/danni-cool/wechatbot-webhook/issues/38)                                                                                                                                                                                  | `String`          | `1` `0`                 | -                                                |
| isSystemEvent | 是否是来自系统消息事件（比如上线，掉线、异常事件）                                                                                                                                                                                                                        | `String`          | `1` `0`                 | -                                                |

**服务端处理 formData 一般需要对应的处理程序，假设你已经完成这一步，你将得到以下 request**

```json
  {
    "type": "text",
    "content": "你好",
    "source": "{\"room\":\"\",\"to\":{\"_events\":{},\"_eventsCount\":0,\"id\":\"@f387910fa45\",\"payload\":{\"alias\":\"\",\"avatar\":\"/cgi-bin/mmwebwx-bin/webwxgeticon?seq=1302335654&username=@f38bfd1e0567910fa45&skey=@crypaafc30\",\"friend\":false,\"gender\":1,\"id\":\"@f38bfd1e10fa45\",\"name\":\"ch.\",\"phone\":[],\"star\":false,\"type\":1}},\"from\":{\"_events\":{},\"_eventsCount\":0,\"id\":\"@6b5111dcc269b6901fbb58\",\"payload\":{\"address\":\"\",\"alias\":\"\",\"avatar\":\"/cgi-bin/mmwebwx-bin/webwxgeticon?seq=123234564&username=@6b5dbb58&skey=@crypt_ec356afc30\",\"city\":\"Mars\",\"friend\":false,\"gender\":1,\"id\":\"@6b5dbd3facb58\",\"name\":\"Daniel\",\"phone\":[],\"province\":\"Earth\",\"signature\":\"\",\"star\":false,\"weixin\":\"\",\"type\":1}}}",
    "isMentioned": "0",
    "isSystemEvent": "0"
  }
```


#### 返回值（可选）

- ContentType: `json` | `null`

| 参数 |  说明 | 数据类型 | 默认值 | 可否为空 | 可选参数 |
| -- | -- | -- | -- | -- | -- |
| success | 该条请求成功与否，返回 false 或者无该字段，不会处理回复，**有一些特殊消息也通过这个字段控制，比如加好友邀请，返回 `true` 则会通过好友请求** | `Boolean` | - | Y | `true` `false` |
| data | 如果需要回复消息的话，需要定义data字段 | `Object` `Object Array` | - | Y | |

data 结构

| 参数 |  说明 | 数据类型 | 默认值 | 可否为空 | 可选参数 |
| -- | -- | -- | -- | -- | -- |
| type | **消息类型**，该字段不填默认当文本类型传输 | `String`  | - | Y | `text`  `fileUrl` | 支持 **文字** 和 **文件**，  |
| content | **消息内容**，如果希望发多个Url并解析，type 指定为 fileUrl 同时，content 里填 url 以英文逗号分隔 | `String` | - | Y | - |

如果回复单条消息

```json
 {
    "success": true,
    "data": {
      "type": "text",
      "message": "hello world！"
    }
  }
```

组合回复多条消息

```json
 {
    "success": true,
    "data": [
      {
        "type": "text",
        "message": "hello world！"
      },
      {
        "type": "fileUrl",
        "message": "https://samplelib.com/lib/preview/mp3/sample-3s.mp3"
      }
    ]
  }
```

### 3. 登录API

1. 在异常或者掉线事件触发后，通知你配置的 `RECVD_MSG_API`，
2. 在收到通知后，访问登录 Api 扫码登录 <http://localhost:3001/login?token=YOUR_PERSONAL_TOKEN。>

#### 自定义token

token 初次启动项目会自动生成，你也可以配置一个简单好记的token， 如果都配置，docker 配置将覆盖本地配置

1. docker 启动，参数为 -e LOGIN_API_TOKEN="YOUR_PERSONAL_TOKEN"
2. `.env` 文件中，配置 LOCAL_LOGIN_API_TOKEN=YOUR_PERSONAL_TOKEN

| API 路径    | Query Params | Methods | 描述                                                                          |
| ----------- | ------------ | ------- | ----------------------------------------------------------------------------- |
| /login      | token        | `GET`   | 登录成功，返回及当前用户。登录态掉了，跳转最新的登录二维码                    |


## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=danni-cool/wechatbot-webhook&type=Date)](https://star-history.com/#danni-cool/wechatbot-webhook&Date)

## ⏫ 更新日志

更新内容参见 [CHANGELOG](https://github.com/danni-cool/docker-wechat-roomBot/blob/main/CHANGELOG.md)
