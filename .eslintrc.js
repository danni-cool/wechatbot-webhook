/** @type {import('eslint').Linter.BaseConfig} */
module.exports = {
  env: {
    node: true,
    es6: true
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  parser: '@typescript-eslint/parser',
  plugins: ['prettier'],
  extends: ['prettier', 'plugin:oxlint/recommended'],
  rules: {
    'prettier/prettier': 'error' /** check prettier lint */
  }
}
