# RECVD_MSG_API Source 字段示例

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
        "memberIdList": [ //群里人的id
          "@xxxx",
          "@xxxx"
        ],
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
