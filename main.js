require('dotenv').config()
const { PORT } = process.env
const express = require('express');
const wechatBotInit = require('./src/wechaty/init')
const registerRoute = require('./src/route')
const app = express();
const bot = wechatBotInit()

app.use(express.json());

// 注册webhook
registerRoute({app, bot})

app.listen(PORT, () => {
  console.log(`service is running, Port is ${PORT}`);
});