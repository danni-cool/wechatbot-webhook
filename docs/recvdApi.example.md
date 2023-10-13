
# RECVD_MSG_API  JSON 示例

## formData.content  `String` | `Binary`

`formData` 内的字段和 `formData.content` 映射如下：

<table>
  <thead>
    <tr><th>字段条件</th> <th>字段类型说明</th> <th>formData.content 数据结构</th></tr>
  </thead>
  <tbody>
      <tr><td><code>formData.isSystemEvent</code> === '1'</td><td> <code>json string</code></td><td>

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

</td></tr>
<tr>
<td><code>formData.type</code> === 'urlLink'</td>
<td>
<code>json string</code>
</td>
<td>

```js
{
  description: "AI技术逐渐成为设计师的灵感库",
  thumbnailUrl: "",
  title: "AI神器帮助你从小白秒变设计师",
  url: "http://example.url",
}
```

</td>
</tr>
  </tbody>
</table>

### 时，返回 json string 如下

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
