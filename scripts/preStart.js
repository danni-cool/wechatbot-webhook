// 给 shell 调用使用
const fs = require('fs')
const path = require('path')
const { generateToken } = require('../src/utils/index.js')
const sourceFile = path.join(__dirname, '../.env.example')
const destFile = path.join(__dirname, '../.env')
const { logger } = require('../src/utils/log.js')

// 根据env.example 生成 .env 文件
if (!fs.existsSync(destFile)) {
  // 如果不存在，则从 env.example 复制
  fs.copyFileSync(sourceFile, destFile)
  logger.info('.env file created from .env.example')
}

// 读取 .env 文件内容
const envContent = fs.readFileSync('.env', 'utf-8').split('\n')

// 解析 .env 文件内容
const envConfig = require('dotenv').parse(envContent.join('\n'))

// 无配置token，会默认生成一个token
if (envConfig.LOCAL_LOGIN_API_TOKEN) process.exit(0) // 0 表示正常退出

const token = generateToken()
logger.info(
  `检测未配置 LOGIN_API_TOKEN, 写入初始化值 LOCAL_LOGIN_API_TOKEN=${token}  => .env \n`
)

envConfig.LOCAL_LOGIN_API_TOKEN = token // 添加或修改键值对

// 生成新的 .env 文件内容，同时保留注释
let newEnv = envContent
  .map((line) => {
    if (line.startsWith('#')) {
      // 保留注释
      return line
    }

    const [key] = line.split('=')
    if (envConfig[key] !== undefined) {
      // 更新已存在的键值对
      const updatedLine = `${key}=${envConfig[key]}`
      delete envConfig[key] // 从 envConfig 中移除已处理的键
      return updatedLine
    }

    return line
  })
  .join('\n')

// 将未在原始 .env 文件中的新键值对添加到文件末尾
for (const [key, value] of Object.entries(envConfig)) {
  newEnv += `\n${key}=${value}`
}

// 写入新的 .env 文件内容
fs.writeFileSync('.env', newEnv)
