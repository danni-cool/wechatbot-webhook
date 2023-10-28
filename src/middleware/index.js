const fs = require('fs')
const path = require('path')

// 获取当前目录下的所有文件
const files = fs.readdirSync(__dirname)

files.forEach((file) => {
  // 排除当前的 index.js 文件
  if (file !== 'index.js') {
    // 导入文件
    const module = require(path.join(__dirname, file))
    // 导出文件中的所有内容
    Object.assign(exports, module)
  }
})
