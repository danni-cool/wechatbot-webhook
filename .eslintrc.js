module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  plugins: ['prettier'],
  extends: ['standard', 'prettier'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'prettier/prettier': 'error',
    'valid-typeof': 0 /** js 配置这个太麻烦，不如上ts */,
  },
}
