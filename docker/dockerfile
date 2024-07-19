# 使用 Node.js 18 作为基础镜像
FROM node:18-alpine

# 创建工作目录
WORKDIR /app

# 非依赖变更缓存改层
COPY package.json pnpm-lock.yaml .npmrc ./

# 创建 patches 目录并复制所有内容
COPY patches ./patches

# 安装应用程序依赖项
RUN npm install -g pnpm && pnpm install --production&& pnpm store prune && npm uninstall pnpm -g

# 复制应用程序代码到工作目录
COPY . .

# 如果收消息想接入webhook
ENV RECVD_MSG_API=
# 默认登录API接口访问token
ENV LOGIN_API_TOKEN=
# 是否禁用默认登录
ENV DISABLE_AUTO_LOGIN=
# 运行时提示的消息等级（默认info，想有更详细的日志，可以指定为debug)
ENV LOG_LEVEL=info
# RECVD_MSG_API 是否接收来自自己发的消息（设置为true，即接收）
ENV ACCEPT_RECVD_MSG_MYSELF=false

# 暴露端口（你的 Express 应用程序监听的端口）
EXPOSE 3001

# 启动应用程序
CMD ["npm", "start"]