const path = require("path");
const os = require("os");

// 引入eslint 插件
const ESLintPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// 获取cpu 核数 ，开启多进程打包，对比较大的项目可以加速打包速度
const threads = os.cpus().length;

module.exports = {
  // 入口文件
  entry: "./src/main.js", //相对路径
  // 输出
  output: {
    // 文件的输出路径,当前根目录
    path: undefined, //绝对路径
    filename: "static/js/main.js",
    // 清空上一次打包的
    // clean: true,

    // assetModuleFilename: "images/[hash][ext][query]",
  },
  //   加载器
  module: {
    rules: [
      // loader的配置
      {
        oneOf: [
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
            // exclude: /(node_modules)/, //排查node_modules文件不处理
            include: path.resolve(__dirname, "../src"), //只处理src下的文件 和上面的只能选择一个
            use: [
              {
                loader: "thread-loader",
                options: {
                  works: threads, //开启多少进程加速打包
                },
              },
              {
                loader: "babel-loader",
                options: {
                  cacheDirectory: true, //开启babel缓存
                  cacheCompression: false, //关闭缓存文件压缩,这2个设置可以加速打包速度
                },
              },
            ],
          },
        ],
      },
    ],
  },
  //   插件
  plugins: [
    // 插件的配置
    new ESLintPlugin({
      // 监测有那些文件
      exclude: "node_modules", //排查node_modules文件不处理
      context: path.resolve(__dirname, "../src"),
      cache: true, //开启缓存
      cacheLocation: path.resolve(
        __dirname,
        "../node_modules/.cache/eslintcache"
      ),
      threads, //开启多进程
    }),
    new HtmlWebpackPlugin({
      // 模板,以/public/index.html为模板创建新的html文件
      // 新的html文件的特点：1结构和原来的一致，自动引入打包输出的资源
      template: path.resolve(__dirname, "../public/index.html"),
    }),
  ],

  devServer: {
    host: "localhost",
    port: "3000", //启动服务器的端口号
    open: true, //是否默认打开浏览器
    hot: true, //开启HMR 只更新改动的部分 热模块只支持css js改变还是全部重新编译
  },
  //   模式
  mode: "development",
  devtool: "cheap-module-source-map",
};
