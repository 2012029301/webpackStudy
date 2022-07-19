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
      {
        test: /\.css$/i, //检查以.css 结尾的文件
        use: [
          "style-loader", //将js中css通过创建style标签添加到html文件中生效
          "css-loader", //将css资源编译成common.js的模块js中
        ],
      },
      {
        test: /\.less$/i,
        use: [
          //use 可以使用多个loader loader 只能使用一个
          // compiles Less to CSS
          "style-loader",
          "css-loader",
          "less-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif|webp|svg)/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 10kb 小于10k 转成bas64 不过体积会大一点
          },
        },
      },
    ],
  },
  //   插件
  plugins: [
    // 插件的配置
  ],
  //   模式
  mode: "development",
};
