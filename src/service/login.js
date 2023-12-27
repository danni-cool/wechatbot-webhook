const { LOGIN_API_TOKEN, LOCAL_LOGIN_API_TOKEN } = process.env

module.exports = {
  // 得到 loginAPIToken
  getLoginApiToken() {
    if (!process.env.globalLoginToken) {
      process.env.globalLoginToken = LOGIN_API_TOKEN || LOCAL_LOGIN_API_TOKEN
    }

    return process.env.globalLoginToken
  },
}
