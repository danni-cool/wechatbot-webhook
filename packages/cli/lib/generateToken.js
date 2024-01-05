module.exports = (num = 12) => {
  const charset =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.~'
  let token = ''
  for (let i = 0; i < num; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    token += charset[randomIndex]
  }
  return token
}
