# RECVD_MSG_API JSON 示例

## formData 请求体不同情况说明

### 文字消息 `formData.type === text`

- 是否支持快捷回复：✅
- `formData.content`: `String`

### 文件消息 `formData.type === file`

- 是否支持快捷回复：✅
- `formData.content`: `binary`

### 公众号推文 `formData.type === urlLink`

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

### 加好友请求 `formData.type === friendship`

- 是否支持快捷回复：✅
- `formData.content`：`json`

```json
{
  "name": "加你的人昵称",
  "hello": "朋友验证消息"
}
```

> 通过好友请求，需要通过接口返回 `{ "success": true }` 字段

### 4. 系统消息 `formData.isSystemEvent === '1'`

- 是否支持快捷回复：❌
- `formData.content`: `json`
示例
```js
{
  "event": "login", // login | logout | error

  "user": { // 当前的用户信息，没有则为null
    "_events": {},
    "_eventsCount": 0,
    "id": "@xxxasdfsf",
    "payload": {
      "alias": "",
      "avatar": "",
      "friend": false,
      "gender": 1,
      "id": "@xxx",
      "name": "somebody",
      "phone": [],
      "star": false,
      "type": 1
    }

    "error": ''// js 报错的错误栈信息
  }
}
```


## formData.source `String`

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
          {id: '@xxxx', name:'昵称', alias: '备注名' }
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
            "avatar": "xxx",
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
        "avatar": "xxx",
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
