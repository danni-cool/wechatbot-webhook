<div align="center">
<img src="./docs/Jietu20240506-220141%402x.jpg" width="500"/>

![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/danni-cool/wechatbot-webhook/release.yml) ![npm dowloads](https://img.shields.io/npm/dm/wechatbot-webhook?label=npm/downloads)
 ![Docker Pulls](https://img.shields.io/docker/pulls/dannicool/docker-wechatbot-webhook) ![GitHub release (with filter)](https://img.shields.io/github/v/release/danni-cool/wechatbot-webhook)
<a href="https://discord.gg/qBF9VsBdc8"><img src="https://img.shields.io/discord/1165844612473172088?logo=Discord&link=https%3A%2F%2Fdiscord.gg%qBF9VsBdc8" /></a>


[🚢 Docker 镜像](https://hub.docker.com/r/dannicool/docker-wechatbot-webhook/tags) | [📦 NPM包](https://www.npmjs.com/package/wechatbot-webhook)｜[🔍 FAQ](https://github.com/danni-cool/wechatbot-webhook/issues/72)

一个小小的微信机器人webhook，帮你抹平了很多自己开发的障碍，基于 http 请求，与hooks微信不同，因为基于web api，所以优势在于可以部署到arm架构等设备上
</div>


## ✨ Features

> [!Caution] 
> 项目目前基于web微信，其本身就有被限制风险，另外大概两天一掉线，除了正常功能修补，不接新的 feature request。 windows 协议正在WIP，近期应该会和大家见面！

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

> 如遇安装报错，请确保自己的node版本 >= 18.14.1 [#227](https://github.com/danni-cool/wechatbot-webhook/issues/227)

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

## 🔧 开发

> [!IMPORTANT] 
> 包管理器迁移已至 pnpm，安装依赖请使用它，以支持一些不定时的临时包修补（patches）和加速依赖安装

## ⛰️ 部署 Deploy（推荐）


#### 1.使用 docker 部署

##### 拉取最新镜像

```
docker pull dannicool/docker-wechatbot-webhook
```

##### docker 部署

```bash
# 启动容器并映射日志目录，日志按天维度生成，e.g: app.2024-01-01.log
docker run -d --name wxBotWebhook -p 3001:3001 \
-v ~/wxBot_logs:/app/log \
dannicool/docker-wechatbot-webhook
```

##### 使用 compose 部署 (可选)

```bash
wget -O docker-compose.yml https://cdn.jsdelivr.net/gh/danni-cool/wechatbot-webhook@main/docker-compose.yml && docker-compose down && docker-compose -p wx_bot_webhook up
```

#### 2.登录

```bash
docker logs -f wxBotWebhook
```

找到二维码登录地址，图下 url 部分，浏览器访问，扫码登录wx

<https://localhost:3001/login?token=[YOUR_PERSONAL_TOKEN]>

#### 可选 env 参数

> Tips：需要增加参数使用 -e，多行用 \ 隔开，例如 -e  RECVD_MSG_API="<https://example.com/your/url>" \

| 功能  | 变量 | 备注 |
|--|--|--|
| 日志级别 | LOG_LEVEL=info | 日志级别，默认 info，只影响当前日志输出，详细输出考虑使用 debug。无论该值如何变化，日志文件总是记录debug级别的日志 |
|  收消息 API |  RECVD_MSG_API=<https://example.com/your/url>   |  如果想自己处理收到消息的逻辑，比如根据消息联动，填上你的处理逻辑 url |
| 收消息 API 接受自己发的消息 | ACCEPT_RECVD_MSG_MYSELF=false | RECVD_MSG_API 是否接收来自自己发的消息（设置为true，即接收, 默认false） |
| 自定义登录 API token | LOGIN_API_TOKEN=abcdefg123 | 你也可以自定义一个自己的登录令牌，不配置的话，默认会生成一个 |
| 禁用自动登录 | DISABLE_AUTO_LOGIN=true |  **非微信踢下线账号，可以依靠当前登录的session免登**, 如果想每次都扫码登陆，则增加该条配置 |

## 🛠️ API

### 1. 推消息 API

> v2版本接口增加了群发功能，v1 版本接口请移步 [legacy-api](./docs/legacy-api.md)

- Url：<http://localhost:3001/webhook/msg/v2?token=[YOUR_PERSONAL_TOKEN]>
- Methods: `POST`
- ContentType: `application/json`
- Body: 格式见下面表格

#### `payload` 结构

> 发文字或文件外链, 外链会解析成图片或者文件

| 参数 |  说明 | 数据类型 | 默认值 | 可否为空 | 可选参数 |
| -- | -- | -- | -- | -- | -- |
| to | **消息接收方**，传入`String` 默认是发给昵称（群名同理）, 传入`Object` 结构支持发给备注过的人，比如：`{alias: '备注名'}`，群名不支持备注名 | `String`  `Object` | -  |  N  | - |
| isRoom | **是否发给群消息**，这个参数决定了找人的时候找的是群还是人，因为昵称其实和群名相同在技术处理上 | `Boolean` | `false`  | Y  |  `true`  `false`  |
| data | 消息体结构,见下方 `payload.data` | `Object`  `Array` | `false`  | N  |  `true`  `false`  |

#### `payload.data` 结构

| 参数 |  说明 | 数据类型 | 默认值 | 可否为空 | 可选参数 |
| -- | -- | -- | -- | -- | -- |
| type | **消息类型**, 字段留空解析为纯文本 | `String`  `text` | - | Y | `text`  `fileUrl` | 支持 **文字** 和 **文件**，  |
| content | **消息内容**，如果希望发多个Url并解析，type 指定为 fileUrl 同时，content 里填 url 以英文逗号分隔 | `String` | - | N | - |

#### Example（curl）

##### 发单条消息

```bash
curl --location 'http://localhost:3001/webhook/msg/v2?token=[YOUR_PERSONAL_TOKEN]' \
--header 'Content-Type: application/json' \
--data '{
    "to": "testUser",
    "data": { "content": "你好👋" }
}'
```

##### 发文件 url 同时支持修改成目标文件名

> 有些情况下，直接发送 url 文件名可能不是我们想要的，给 url 拼接 query 参数 `$alias` 可用于指定发送给目标的文件名（注意：别名不做文件转换）

```bash
curl --location 'http://localhost:3001/webhook/msg/v2?token=[YOUR_PERSONAL_TOKEN]' \
--header 'Content-Type: application/json' \
--data '{
    "to": "testUser",
    "data": { 
      "type": "fileUrl" , 
      "content": "https://download.samplelib.com/jpeg/sample-clouds-400x300.jpg?$alias=cloud.jpg" 
    }
}'
```

##### 发给群消息

```bash
curl --location 'http://localhost:3001/webhook/msg/v2?token=[YOUR_PERSONAL_TOKEN]' \
--header 'Content-Type: application/json' \
--data '{
    "to": "testGroup",
    "isRoom": true,
    "data": { "type": "fileUrl" , "content": "https://download.samplelib.com/jpeg/sample-clouds-400x300.jpg" },
}'
```

##### 同一对象多条消息(群消息同理)

```bash
curl --location 'http://localhost:3001/webhook/msg/v2?token=[YOUR_PERSONAL_TOKEN]' \
--header 'Content-Type: application/json' \
--data '{
    "to": "testUser",
    "data": [
        {
            "type": "text",
            "content": "你好👋"
        },
        {
            "type": "fileUrl",
            "content": "https://samplelib.com/lib/preview/mp3/sample-3s.mp3"
        }
    ]
}'
```

##### 群发消息

``` bash
curl --location 'http://localhost:3001/webhook/msg/v2?token=[YOUR_PERSONAL_TOKEN]' \
--header 'Content-Type: application/json' \
--data '[
    {
        "to": "testUser1",
        "data": {
            "content": "你好👋"
        }
    },
    {
        "to": "testUser2",
        "data": [
          {
            "content": "你好👋"
          },
          {
            "content": "近况如何？"
          }
        ]
    }
]'
```

#### 返回值 `response` 结构

- **`success`**: 消息发送成功与否，群发消息即使部份发送成功也会返回 `true`
- **`message`**: 出错时提示的消息
  - 消息发送成功: Message sent successfully
  - 参数校验不通过: Some params is not valid, sending task is suspend...
  - 消息都发送失败: All Messages [number] sent failed...
  - 部份发送成功: Part of the message sent successfully...
- **`task`**: 发送任务详细信息
  - `task.successCount`: 发送成功条数
  - `task.totalCount`: 总消息条数
  - `task.failedCount`: 发送失败条数
  - `task.reject`: 因为参数校验不通过的参数和 error 提示
  - `task.sentFailed`: 因为发送失败和 error 提示
  - `task.notFound`: 因为未找到用户或者群和 error 提示

> 确保消息单次发送一致性，某一条参数校验失败会终止所有消息发送任务

```json
{
    "success": true,
    "message": "",
    "task": {
        "successCount": 0,
        "totalCount": 0,
        "failedCount": 0,
        "reject": [],
        "sentFailed": [],
        "notFound": []
    }
}
```

#### 读文件发送

> 读文件暂时只支持单条发送

- Url：<http://localhost:3001/webhook/msg?token=[YOUR_PERSONAL_TOKEN]>
- Methods: `POST`
- ContentType: `multipart/form-data`
- FormData: 格式见下面表格

##### `payload` 结构

| 参数    | 说明                                                                             | 数据类型 | 默认值 | 可否为空 | 可选值  |
| ------- | -------------------------------------------------------------------------------- | -------- | ------ | -------- | ------- |
| to      | 消息接收方，传入`String` 默认是发给昵称（群名同理）, 传入 Json String 结构支持发给备注过的人，比如：--form 'to="{alias: \"小号\"}"'，群名不支持备注名称                                       | `String` | -      | N        | -       |
| isRoom  | **是否发的群消息**，formData纯文本只能使用 `String` 类型，`1`代表是，`0`代表否， | `String` | `0`    | Y        | `1` `0` |
| content | **文件**，本地文件一次只能发一个，多个文件手动调用多次                           | `Binary` | -      | N        | -       |

##### Curl

```bash
curl --location --request POST 'http://localhost:3001/webhook/msg?token=[YOUR_PERSONAL_TOKEN]' \
--form 'to=testGroup' \
--form content=@"$HOME/demo.jpg" \
--form 'isRoom=1'
```

#### 返回值 `response` 结构

```json
{
  "success": true,
  "message": "Message sent successfully"
}
```

### 2. 收消息 API

#### `payload` 结构
  - Methods: `POST`
  - ContentType: `multipart/form-data`
  - Form格式如下

| formData      | 说明                                                                                                                                                                                                                                                                      | 数据类型          | 可选值                  | 示例                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ----------------------- | ------------------------------------------------ |
| type          | <div>功能类型</div><ul><li>✅ 文字(text)</li><li>✅ 链接卡片(urlLink)</li><li>✅ 图片(file)</li><li>✅ 视频(file)</li><li>✅ 附件(file)</li> <li>✅ 语音(file)</li><li>✅ 添加好友邀请(friendship)</li></ul><div>其他类型</div><ul><li>未实现的消息类型(unknown)</li></ul><div>系统类型</div><ul><li>✅ 登录(system_event_login)</li><li>✅ 登出(system_event_logout)</li><li>✅ 异常报错(system_event_error)</li><li>✅ 快捷回复后消息推送状态通知(system_event_push_notify)</li></ul> | `String`          | `text` `file` `urlLink` `friendship` `unknown` `system_event_login` `system_event_logout` `system_event_error` `system_event_push_notify`| -                                                |
| content       | 传输的内容, 文本或传输的文件共用这个字段，结构映射请看示例                                                                                                                                                                                                                | `String` `Binary` |                         | [示例](docs/recvdApi.example.md#formdatacontent) |
| source        | 消息的相关发送方数据, JSON String                                                                                                                                                                                                                                         | `String`          |                         | [示例](docs/recvdApi.example.md#formdatasource)  |
| isMentioned   | 该消息是@我的消息 [#38](https://github.com/danni-cool/wechatbot-webhook/issues/38)                                                                                                                                                                                  | `String`          | `1` `0`                 | -                                                |
| isMsgFromSelf | 是否是来自自己的消息 [#159](https://github.com/danni-cool/wechatbot-webhook/issues/159) | `String`          | `1` `0`                 | -                                                |

**服务端处理 formData 一般需要对应的处理程序，假设你已经完成这一步，你将得到以下 request**

```json
  {
    "type": "text",
    "content": "你好",
    "source": "{\"room\":\"\",\"to\":{\"_events\":{},\"_eventsCount\":0,\"id\":\"@f387910fa45\",\"payload\":{\"alias\":\"\",\"avatar\":\"/cgi-bin/mmwebwx-bin/webwxgeticon?seq=1302335654&username=@f38bfd1e0567910fa45&skey=@crypaafc30\",\"friend\":false,\"gender\":1,\"id\":\"@f38bfd1e10fa45\",\"name\":\"ch.\",\"phone\":[],\"star\":false,\"type\":1}},\"from\":{\"_events\":{},\"_eventsCount\":0,\"id\":\"@6b5111dcc269b6901fbb58\",\"payload\":{\"address\":\"\",\"alias\":\"\",\"avatar\":\"/cgi-bin/mmwebwx-bin/webwxgeticon?seq=123234564&username=@6b5dbb58&skey=@crypt_ec356afc30\",\"city\":\"Mars\",\"friend\":false,\"gender\":1,\"id\":\"@6b5dbd3facb58\",\"name\":\"Daniel\",\"phone\":[],\"province\":\"Earth\",\"signature\":\"\",\"star\":false,\"weixin\":\"\",\"type\":1}}}",
    "isMentioned": "0",
    "isMsgFromSelf": "0",
    "isSystemEvent": "0" // 考虑废弃，请使用type类型判断系统消息
  }
```

**收消息 api curl示例(直接导入postman调试）**

```curl
curl --location 'https://your.recvdapi.com' \
--form 'type="file"' \
--form 'content=@"/Users/Downloads/13482835.jpeg"' \
--form 'source="{\\\"room\\\":\\\"\\\",\\\"to\\\":{\\\"_events\\\":{},\\\"_eventsCount\\\":0,\\\"id\\\":\\\"@f387910fa45\\\",\\\"payload\\\":{\\\"alias\\\":\\\"\\\",\\\"avatar\\\":\\\"/cgi-bin/mmwebwx-bin/webwxgeticon?seq=1302335654&username=@f38bfd1e0567910fa45&skey=@crypaafc30\\\",\\\"friend\\\":false,\\\"gender\\\":1,\\\"id\\\":\\\"@f38bfd1e10fa45\\\",\\\"name\\\":\\\"ch.\\\",\\\"phone\\\":[],\\\"star\\\":false,\\\"type\\\":1}},\\\"from\\\":{\\\"_events\\\":{},\\\"_eventsCount\\\":0,\\\"id\\\":\\\"@6b5111dcc269b6901fbb58\\\",\\\"payload\\\":{\\\"address\\\":\\\"\\\",\\\"alias\\\":\\\"\\\",\\\"avatar\\\":\\\"/cgi-bin/mmwebwx-bin/webwxgeticon?seq=123234564&username=@6b5dbb58&skey=@crypt_ec356afc30\\\",\\\"city\\\":\\\"Mars\\\",\\\"friend\\\":false,\\\"gender\\\":1,\\\"id\\\":\\\"@6b5dbd3facb58\\\",\\\"name\\\":\\\"Daniel\\\",\\\"phone\\\":[],\\\"province\\\":\\\"Earth\\\",\\\"signature\\\":\\\"\\\",\\\"star\\\":false,\\\"weixin\\\":\\\"\\\",\\\"type\\\":1}}}"' \
--form 'isMentioned="0"'
```


#### 返回值 `response` 结构（可选）

> 如果期望用 `RECVD_MSG_API` 收消息后立即回复(**快捷回复**)，请按以下结构返回返回值，无返回值则不会回复消息

- ContentType: `json`

| 参数 |  说明 | 数据类型 | 默认值 | 可否为空 | 可选参数 |
| -- | -- | -- | -- | -- | -- |
| success | 该条请求成功与否，返回 false 或者无该字段，不会处理回复，**有一些特殊消息也通过这个字段控制，比如加好友邀请，返回 `true` 则会通过好友请求** | `Boolean` | - | Y | `true` `false` |
| data | 如果需要回复消息的话，需要定义data字段 | `Object` `Object Array` | - | Y | |

#### `response.data` 结构

| 参数 |  说明 | 数据类型 | 默认值 | 可否为空 | 可选参数 |
| -- | -- | -- | -- | -- | -- |
| type | **消息类型**，该字段不填默认当文本类型传输 | `String`  | `text` | Y | `text`  `fileUrl` | 支持 **文字** 和 **文件**，  |
| content | **消息内容**，如果希望发多个Url并解析，type 指定为 fileUrl 同时，content 里填 url 以英文逗号分隔 | `String` | - | N | - |

如果回复单条消息

```json
 {
    "success": true,
    "data": {
      "type": "text",
      "content": "hello world！"
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
        "content": "hello world！"
      },
      {
        "type": "fileUrl",
        "content": "https://samplelib.com/lib/preview/mp3/sample-3s.mp3"
      }
    ]
  }
```

### 3. 其他API

#### token 配置说明
> 除了在 docker 启动时配置token，在默认缺省 token 的情况，会默认生成一个写入 `.env` 文件中

#### 3.1 获取登录二维码接口
- **地址**：`/login`
- **methods**: `GET`
- **query**: token
- **status**: `200`
- **example**: http://localhost:3001/login?token=[YOUR_PERSONAL_TOKEN]

##### 登录成功

返回 json 包含当前用户

```json
{"success":true,"message":"Contact<TestUser>is already login"}
```

##### 登录失败

展示微信登录扫码页面

#### 3.2 健康检测接口

可以主动轮询该接口，检查服务是否正常运行

- **地址**：`/healthz`
- **methods**: `GET`
- **query**: token
- **status**: `200`
- **example**: http://localhost:3001/healthz?token=[YOUR_PERSONAL_TOKEN]

微信已登录, 返回纯文本 `healthy`，否则返回 `unHealthy`

#### 3.3 获取静态资源接口

从 2.8.0 版本开始，可以通过本接口访问到头像等静态资源，具体见 [recvd_api 数据结构示例的 avatar 字段](/docs/recvdApi.example.md#2-formdatasource-string)

注意所有上报 recvd_api 的静态资源地址不会默认带上 token, 需要自己拼接，否则会返回 401 错误, 请确保自己微信已登录，需要通过登录态去获取资源

- **地址**：`/resouces`
- **methods**: `GET`
- **query**: 
  - token: 登录token
  - media: encode过的相对路径，比如 `/avatar/1234567890.jpg` encode为 `avatar%2F1234567890.jpg`
- **status**: `200` `404` `401`

- **example**：http://localhost:3001/resouces?media=%2Fcgi-bin%2Fmmwebwx-bin%2Fwebwxgetheadimg%3Fseq%3D83460%26username%3D%40%4086815a%26skey%3D&token=[YOUR_PERSONAL_TOKEN]

##### status: `200`

成功获取资源, 返回静态资源文件

##### status: `404`

获取资源失败

##### status: `401` 未携带登录token

```json
{"success":false, "message":"Unauthorized: Access is denied due to invalid credentials."}
```

##### status: `401` 微信登录态已过期

```json
{
   "success": false, "message": "you must login first"
}
```


## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=danni-cool/wechatbot-webhook&type=Date)](https://star-history.com/#danni-cool/wechatbot-webhook&Date)

## Contributors

Thanks to all our contributors!

<a href="https://github.com/danni-cool/wechatbot-webhook/graphs/contributors">![](https://contrib.rocks/image?repo=danni-cool/wechatbot-webhook)</a>

## ⏫ 更新日志

更新内容参见 [CHANGELOG](https://github.com/danni-cool/docker-wechat-roomBot/blob/main/CHANGELOG.md)
