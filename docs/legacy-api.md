# 推消息 API

## V1 版本

- Url：<http://localhost:3001/webhook/msg>
- Methods: `POST`

#### Case1. 发文字或文件(外链)

- ContentType: `application/json`
- Body: 格式见下面表格

> json 请求发送文件只支持外链

| 参数 |  说明 | 数据类型 | 默认值 | 可否为空 | 可选参数 |
| -- | -- | -- | -- | -- | -- |
| to | **消息接收方**，传入`String` 默认是发给昵称（群名同理）, 传入`Object` 结构支持发给备注过的人，比如：`{alias: '备注名'}`，群名不支持备注名 | `String` `Object` | -  |  N  | - |
| isRoom | **是否发的群消息**，这个参数决定了找人的时候找的是群还是人，因为昵称其实和群名相同在技术处理上 | `Boolean` | `false`  | Y  |  `true`  `false`  |
| type | **消息类型**，消息不支持自动拆分，请手动拆分| `String`  | `text` | N | `text`  `fileUrl` | 支持 **文字** 和 **文件**，  |
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