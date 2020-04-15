/*
 * @Author: Jane
 * @Date: 2020-04-14 10:53:30
 * @LastEditors: Jane
 * @LastEditTime: 2020-04-15 17:29:12
 * @Descripttion:
 */
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // "quotes": [2, "single"], //单引号
    // 'semi': ["error", "always"], //语句强制分号结尾
    // "spaced-comment": 0, //注释风格不要有空格什么的
    //强制使用单引号
    quotes: ['error', 'single'],
    //强制不使用分号结尾
    semi: ['error', 'always'],
    'spaced-comment': 0,

    'no-restricted-syntax': [
      'error',
      {
        selector: 'ForInStatement',
        message: '禁止使用 for in' // Object.keys
      }
    ]
  }
};
