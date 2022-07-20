module.exports = {
  // extends: ["eslint :recommended"],
  env: {
    node: true, //启用node中的全局变量
    browser: true, //启用浏览器中的全局变量
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
  },
  rules: {
    "no-var": 2, //不能使用var定义变量
  },
};
