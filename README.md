# docker-wechatbot-webhook

基于 [wechaty](https://github.com/wechaty/wechaty#readme) 和 [Express](https://github.com/expressjs/express) 开发

在微信和webhook机器人之间架一座桥梁，从此微信里也可以有自己的webhook机器人了，快用它集成到自己的自动化工作流中吧，推荐 [n8n](https://github.com/n8n-io/n8n)

![Docker Image Version (latest semver)](https://img.shields.io/docker/v/dannicool/docker-wechatbot-webhook) ![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/danni-cool/docker-wechatbot-webhook/release.yml)  ![Docker Pulls](https://img.shields.io/docker/pulls/dannicool/docker-wechatbot-webhook)

[view this project on docker hub :)](https://hub.docker.com/repository/docker/dannicool/docker-wechatbot-webhook/general) 

✅[Todo & Discussion](https://github.com/danni-cool/docker-wechatbot-webhook/issues/11)



## 🚀 启动

### 1. 本地调试

```
npm start
```

其他配置可以在 .env 文件中设置

```
# 如果想换端口
PORT=3001

# 如果想自己处理收到消息的逻辑，比如根据消息联动，在下面填上你的 API 地址, 默认为空
LOCAL_RECVD_MSG_API=https://example.com/your/url
```

### 2. Docker 部署

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

####  可选参数

> Tips：需要增加参数使用 -e，多行用 \ 隔开，例如 -e  RECVD_MSG_API="https://example.com/your/url" \

| 功能 | 环境变量 | 案例 | 备注 |
|--|--|--|--|
|  收消息 API |   RECVD_MSG_API  |   RECVD_MSG_API="https://example.com/your/url"   |  如果想自己处理收到消息的逻辑，比如根据消息联动，填上你的处理逻辑 url，该行可以省略 |
| 自定义登录 API 令牌 | LOGIN_API_TOKEN | LOGIN_API_TOKEN=abcdefg123 | 容器启动后支持通过api 形式获得 登录状态 / 扫码登录 url，你也可以自定义一个自己的令牌，不配置的话，默认会生成一个 |

## 👨🏻‍💻 登录wx

以下只展示 docker 启动，本地调试可以直接在控制台找到链接

```bash
docker logs -f wxBotWebhook
```

找到二维码登录地址，图下 url 部分，浏览器访问，扫码登录wx

![](https://cdn.jsdelivr.net/gh/danni-cool/danni-cool@cdn/image/wechatlogindemo.png)

## 🛠️ API

### 1. 推消息

- Url：<http://localhost:3001/webhook/msg>
- Methods: `POST`

#### Case1. 发文字或文件（json）
- ContentType: `application/json`
- Body: 格式见下面表格

> json 请求发送文件只支持外链

| 参数 |  说明 | 数据类型 | 默认值 | 可否为空 | 可选值 |
|--|--|--|--|--|--|
| to | **会话名**，发群消息填群名，发给个人填昵称 | `String` | -  |  N  | - |
| isRoom | **是否发的群消息**，这个参数决定了找人的时候找的是群还是人，因为昵称其实和群名相同在技术处理上 | `Boolean` | `false`  | Y  |  `true`  `false`  |
| type | **消息类型**，消息不支持自动拆分，请手动调多次，发送的文件 Url 在微信里长啥样，是文件后缀决定的。请使用 `fileUrl` 替代 `img`, `img` 类型将在后面版本废弃， | `String`  | - | N | `text`  `img`  `fileUrl` | 支持 **文字** 和 **文件**，  |
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

#### Case2. 读文件发送（formData)
- ContentType: `multipart/form-data`
- FormData: 格式见下面表格

| 参数 |  说明 | 数据类型 | 默认值 | 可否为空 | 可选值 |
|--|--|--|--|--|--|
| to | **会话名**，发群消息填群名，发给个人填昵称 | `String` | -  |  N  | - |
| isRoom | **是否发的群消息**，formData纯文本只能使用 `String` 类型，`1`代表是，`0`代表否， | `String` | `0`  | Y  |  `1`  `0`  |
| content | **文件**，本地文件一次只能发一个，多个文件手动调用多次 | `Binary` | - | N | - |

##### Curl
```bash
curl --location --request POST 'http://localhost:3001/webhook/msg' \
--form 'to=testGroup' \
--form content=@"$HOME/demo.jpg" \
--form 'isRoom=1'
```

### 2. 收消息

> 收消息接口使用 `form` 传递参数，因为要兼容有文件的情况，文件目前也只兼容了**图片**

入参：

- Methods: `POST`
- ContentType: `multipart/form-data`
- Form格式如下

| formData |  说明 | 数据类型 | 可选值 | 示例 |
|--|--|--|--|-- |
| type | 表单类型 | `String` | `text` / `img` | |
| content | 传输的内容,文件也放在这个字段，如果是图片收到的就是二进制buffer, 如果 `isSystemEvent` 为 '1', 将收到 JSON String | `String` / `Binary`  |  | [示例](docs/recvdApi.example.md#formdatacontent) |
| source | 消息的相关发送方数据, JSON String | `String` | | [示例](docs/recvdApi.example.md#formdatasource) |
| isSystemEvent | 是否是来自系统消息事件（比如上线，掉线、异常事件）| `String` | 1 / 0 | |

### 3. 登录APi

> 已知的是登录几天有几率会掉，应该是网页微信风控的问题（长时间无消息）。

#### 解决方案：

1. 在异常或者掉线事件触发后，通知你配置的 `RECVD_MSG_API`，
2. 在收到通知后，访问登录 Api 处理扫码登录逻辑，外网映射
访问 http://localhost:3001/loginCheck?token=YOUR_PERSONAL_TOKEN。

ps: 有更好的方案 ✨[欢迎交流](https://github.com/danni-cool/docker-wechatbot-webhook/issues/22)

#### 自定义token

token 初次启动项目会自动生成，你也可以配置一个简单好记的token， 如果都配置，docker 配置将覆盖本地配置

1. docker 启动，参数为 -e LOGIN_API_TOKEN="YOUR_PERSONAL_TOKEN"
2. `.env` 文件中，配置 LOCAL_LOGIN_API_TOKEN=YOUR_PERSONAL_TOKEN

#### 请求体

- Methods: `GET`
- URL: http://localhost:3001/loginCheck?token=YOUR_PERSONAL_TOKEN

#### 返回体

| JSON |  说明 | 数据类型 | 可选值 |
|--|--|--|--|
| success | 登录成功与否 | `Boolean` | `true` / `false` |
| message | 当前登录用户名，登录失败将返回扫码登录URL  | `String`  |  |

## ⏫ 更新日志

更新内容参见 [CHANGELOG](https://github.com/danni-cool/docker-wechat-roomBot/blob/main/CHANGELOG.md)
