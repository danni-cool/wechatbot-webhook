#!/usr/bin/env node
const path = require('path')
const { program } = require('commander')
const { version } = require('./package.json')
const { exec } = require('child_process')
const os = require('os')
const fs = require('fs')
const homeDirectory = os.homedir()
const envFilePath = (process.env.homeEnvCfg = path.join(
  homeDirectory,
  './.wechat_bot_env'
))
const memoryCardFile = (process.env.homeMemoryCardPath = path.join(
  homeDirectory,
  './loginSession.memory-card.json'
))

program
  .name('wechatbot-webhook')
  .description(
    [
      '给微信里加个 webhook 机器人',
      '项目地址：https://github.com/danni-cool/wechatbot-webhook'
    ].join('\n')
  )
  .version(version)
  .option('-r, --reload', '想重新扫码时加该参数，不加默认记住上次登录状态')
  .option('-e, --edit', '打开 .wechat_bot_env 配置文件，可以填写上报消息API等')
  .parse()

const options = program.opts()

// 清空 memory-card.json
if (options.reload) {
  if (!fs.existsSync(memoryCardFile)) {
    console.log('暂无登录缓存')
  } else {
    try {
      fs.unlinkSync(memoryCardFile)
      console.log('登录缓存已清空')
    } catch (err) {
      console.error(err)
      process.exit(0)
    }
  }
}

if (options.edit) {
  // 在 Windows 上，可以使用 'start' 命令; 在 macOS 上，使用 'open'; 在 Linux 上，使用 'xdg-open'
  const isWindows = process.platform === 'win32'
  const command = isWindows
    ? `explorer "${envFilePath}"`
    : `open "${envFilePath}" || xdg-open "${envFilePath}"`

  console.log(`执行命令: ${command}`)

  exec(command, (err) => {
    if (err) {
      console.error(`执行出错: ${err}`)
      return
    }
    console.log(`文件 ${envFilePath} 已在编辑器中打开`)
  })

  process.exit(0)
}

require(`${path.join(__dirname, './preStart.js')}`)
require(path.join(__dirname, './lib/bot.js'))
