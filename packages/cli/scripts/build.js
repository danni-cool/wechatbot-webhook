const esbuild = require('esbuild')
const fs = require('fs')
const path = require('path')

fs.copyFileSync(
  path.join(__dirname, '../../../.env.example'),
  path.join(__dirname, '../.env.example')
)

esbuild
  .build({
    entryPoints: ['../../main.js'], // 入口文件
    outfile: 'lib/bot.js', // 输出文件的路径和名称
    bundle: true, // 打包所有的依赖
    minify: true, // 压缩输出文件
    platform: 'node', // 指定目标平台为 Node.js
    external: ['wechaty', 'wechaty-grpc'] // 将 fs 和 path 模块标记为外部依赖
  })
  .catch(() => process.exit(1))
