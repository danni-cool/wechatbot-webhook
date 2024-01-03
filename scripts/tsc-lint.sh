#!/bin/bash

# 使用 Node.js 脚本来创建一个临时的 tsconfig 文件
node ./scripts/create-temp-tsconfig.js

# 使用临时的配置文件运行 tsc
npx tsc --noEmit --project tsconfig.tmp.json
TSC_EXIT_CODE=$?

# 清理：删除临时的配置文件
rm tsconfig.tmp.json

if [[ $TSC_EXIT_CODE != 0 ]]; then
  echo "TypeScript check failed."
  exit 1
fi

echo "TypeScript check passed."