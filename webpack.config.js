const path = require("path");
module.exports = {
  // 入口文件
  entry: "./src/main.js",
  // 输出
  output: {
    // 文件的输出路径,当前根目录
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
  },
  //   加载器
  module: {
    rules: [
      // loader的配置
    ],
  },
  //   插件
  plugins: [
    // 插件的配置
  ],
  //   模式
  mode: "development",
};
