const fs = require('fs')
const { execSync } = require('child_process')

// 读取原始的 tsconfig.json
const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'))

// 获取暂存区的 TypeScript 和 JavaScript 文件
const stagedFiles = execSync(
  'git diff --cached --name-only --diff-filter=ACM | grep -E "\\.(ts|tsx|js|jsx)$"'
)
  .toString()
  .trim()
  .split('\n')
  .filter((f) => f)

// 添加暂存的文件和 typeRoots 中的路径
tsconfig.include = stagedFiles
if (tsconfig.compilerOptions && tsconfig.compilerOptions.typeRoots) {
  tsconfig.include = tsconfig.include.concat(
    tsconfig.compilerOptions.typeRoots.map(
      (/** @type {string} */ tr) => `${tr}/**/*`
    )
  )
}

// 写入临时的 tsconfig 文件
fs.writeFileSync('tsconfig.tmp.json', JSON.stringify(tsconfig, null, 2))
