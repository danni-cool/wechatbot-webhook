# RECVD_MSG_API JSON 示例

## 1. `formData.type` 不同情况说明

### 1.1 功能消息类型

#### 文字消息 `text`

- 是否支持快捷回复：✅
- `formData.content`: `String`

#### 文件消息 `file`

- 是否支持快捷回复：✅
- `formData.content`: `binary`

#### 公众号推文 `urlLink`

- 是否支持快捷回复：❌
- `formData.content`：`json`

示例
```json
{
  "description": "AI技术逐渐成为设计师的灵感库",
  "thumbnailUrl": "",
  "title": "AI神器帮助你从小白秒变设计师",
  "url": "http://example.url",
}
```

#### 加好友请求 `friendship`

- 是否支持快捷回复：✅
- `formData.content`：`json`

```json
{
  "name": "加你的人昵称",
  "hello": "朋友验证消息"
}
```

> 通过好友请求，需要通过接口返回 `{ "success": true }` 字段

### 1.2 其他消息类型

#### 不支持的消息类型 `unknown`

- 是否支持快捷回复：✅

没法在当前版本微信中展示的消息，如果能展示值，会以**文本形式**展示，否则为空

例如：
- [unknown 类型里拍一拍消息提示](https://github.com/danni-cool/wechatbot-webhook/pull/121)


### 1.3 系统通知消息类型

- 是否支持快捷回复：❌

#### 微信已登录/登出 `system_event_login` | `system_event_logout`

- `formData.content`: `json`

```js
{
  "event": "login", // login | logout

  "user": { // 当前的用户信息
    "_events": {},
    "_eventsCount": 0,
    "id": "@xxxasdfsf",
    "payload": {
      "alias": "",
      "avatar": "http://localhost:3001/resouces?media=%2Fcgi-bin%2Fmmwebwx-bixxx", //拼接参数 token=[YOUR_PERSONAL_TOKEN] 访问
      "friend": false,
      "gender": 1,
      "id": "@xxx",
      "name": "somebody",
      "phone": [],
      "star": false,
      "type": 1
    }
  }
}
```

#### 系统运行出错 `system_event_error`
- `formData.content`: `json`
```js
{
  "event": "error", //notifyOfRecvdApiPushMsg

  "user": { // 当前的用户信息
    "_events": {},
    "_eventsCount": 0,
    "id": "@xxxasdfsf",
    "payload": {
      "alias": "",
      "avatar": "http://localhost:3001/resouces?media=%2Fcgi-bin%2Fmmwebwx-bixxx", //拼接参数 token=[YOUR_PERSONAL_TOKEN] 访问
      "friend": false,
      "gender": 1,
      "id": "@xxx",
      "name": "somebody",
      "phone": [],
      "star": false,
      "type": 1
    }
  },

  "error": {} // 具体出错信息 js error stack
}
```

#### 快捷回复后通知 `system_event_push_notify`
- `formData.content`: `json`
```js
{
  "event": "error", //notifyOfRecvdApiPushMsg

  "user": { // 当前的用户信息
    "_events": {},
    "_eventsCount": 0,
    "id": "@xxxasdfsf",
    "payload": {
      "alias": "",
      "avatar": "http://localhost:3001/resouces?media=%2Fcgi-bin%2Fmmwebwx-bixxx", //拼接参数 token=[YOUR_PERSONAL_TOKEN] 访问
      "friend": false,
      "gender": 1,
      "id": "@xxx",
      "name": "somebody",
      "phone": [],
      "star": false,
      "type": 1
    }
  },

  // 快捷回复后触发才返回此结构，如果有部分消息推送失败也在此结构能拿到所有信息, 结构同推消息的api结构
  "recvdApiReplyNotify": {
    "success": true,
    "message": "Message sent successfully",
    "task": {
        "successCount": 1,
        "totalCount": 1,
        "failedCount": 0,
        "reject": [],
        "sentFailed": [],
        "notFound": []
    }
  }
}
```


## 2. formData.source `String`

```js
  {
    // 消息来自群，会有以下对象，否则为空字符串
    "room": {
      "id": "@@xxx",
      "topic": "abc" // 群名
      "payload": {
        "id": "@@xxxx",
        "adminIdList": [],
        "avatar": "xxxx", // 相对路径，应该要配合解密
        "memberList": [
          {
            id: '@xxxx', 
            avatar: "http://localhost:3001/resouces?media=%2Fcgi-bin%2Fmmwebwx-bixxx", //拼接参数 token=[YOUR_PERSONAL_TOKEN] 访问
            name:'昵称', 
            alias: '备注名'/** 个人备注名，非群备注名 */ }
        ]
      },
      //以下暂不清楚什么用途，如有兴趣，请查阅 wechaty 官网文档
      "_events": {},
      "_eventsCount": 0,
    },


    // 消息来自个人，会有以下对象，否则为空字符串
    "to": {
        "id": "@xxx",

        "payload": {
            "alias": "", //备注名
            "avatar": "http://localhost:3001/resouces?media=%2Fcgi-bin%2Fmmwebwx-bixxx", //拼接参数 token=[YOUR_PERSONAL_TOKEN] 访问
            "friend": false,
            "gender": 1,
            "id": "@xxx",
            "name": "xxx",
            "phone": [],
            "signature": "hard mode",
            "star": false,
            "type": 1
        },

        "_events": {},
        "_eventsCount": 0,
      },

    // 消息发送方
    "from": {
      "id": "@xxx",

      "payload": {
        "alias": "",
        "avatar": "http://localhost:3001/resouces?media=%2Fcgi-bin%2Fmmwebwx-bixxx", //拼接参数 token=[YOUR_PERSONAL_TOKEN] 访问
        "city": "北京",
        "friend": true,
        "gender": 1,
        "id": "@xxxx",
        "name": "abc", //昵称
        "phone": [],
        "province": "北京",
        "star": false,
        "type": 1
      },

      "_events": {},
      "_eventsCount": 0,
    }

  }
```
