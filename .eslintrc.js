/** @type {import('eslint').Linter.BaseConfig} */
const config = {
  env: {
    node: true,
    commonjs: true
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'script' // 对于 CommonJS
  },
  rules: {
    'prettier/prettier': 'error' /** check prettier lint */,
    '@typescript-eslint/no-var-requires': 'off' /** only run with commonjs */,
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/ban-ts-comment':
      'off' /** quickly ban all error unnecessary */
  }
}

module.exports = config
