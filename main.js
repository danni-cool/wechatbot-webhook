require('dotenv').config()
const { PORT } = process.env
const express = require('express');
const wechatBotInit = require('./src/wechaty/init')
const registerExpressWebhook = require('./src/webhook')
const app = express();
const bot = wechatBotInit()

app.use(express.json());

// 注册webhook
registerExpressWebhook({app, bot})





app.listen(PORT, () => {
  console.log(`Express server is running on http://localhost:${PORT}`);
});