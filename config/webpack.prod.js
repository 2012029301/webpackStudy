const path = require("path");
// 引入eslint 插件
const ESLintPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // 入口文件
  entry: "./src/main.js", //相对路径
  // 输出
  output: {
    // 文件的输出路径,当前根目录
    path: path.resolve(__dirname, "../dist"), //绝对路径
    filename: "static/js/main.js",
    // 清空上一次打包的
    clean: true,

    // assetModuleFilename: "images/[hash][ext][query]",
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
        generator: {
          filename: "static/[hash:10][ext][query]",
        },
      },
      {
        test: /\.(ttf|woff2?|mp3|mp4|avi)$/,
        type: "asset/resource",

        generator: {
          filename: "static/media/[hash:10][ext][query]",
        },
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/, //排查node_modules文件不处理
        loader: "babel-loader",
      },
    ],
  },
  //   插件
  plugins: [
    // 插件的配置
    new ESLintPlugin({
      // 监测有那些文件
      context: path.resolve(__dirname, "../src"),
    }),
    new HtmlWebpackPlugin({
      // 模板,以/public/index.html为模板创建新的html文件
      // 新的html文件的特点：1结构和原来的一致，自动引入打包输出的资源
      template: path.resolve(__dirname, "../public/index.html"),
    }),
  ],

  //   模式
  mode: "production",
};
