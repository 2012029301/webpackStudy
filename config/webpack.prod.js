// html 和js默认会在prod 中压缩 ，css 不会需要单独配置插件
const path = require("path");
const os = require("os");
// 引入eslint 插件
const ESLintPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

// 获取cpu 核数 ，开启多进程打包，对比较大的项目可以加速打包速度
const threads = os.cpus().length;

const getStyleLoader = (pre) => {
  return [
    //use 可以使用多个loader loader 只能使用一个
    // compiles Less to CSS
    MiniCssExtractPlugin.loader,
    "css-loader",
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [["postcss-preset-env"]],
        },
      },
    },
    pre,
  ].filter(Boolean);
};

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
        //只让一个loader处理,提升打包速度
        oneOf: [
          {
            test: /\.css$/i, //检查以.css 结尾的文件
            use: getStyleLoader(),
          },
          {
            test: /\.less$/i,
            use: getStyleLoader("less-loader"),
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
                  plugins: ["@babel/plugin-transform-runtime"], //  https://webpack.docschina.org/loaders/babel-loader#note-transform-runtime--custom-polyfills-eg-promise-library
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
    new MiniCssExtractPlugin({
      // 把所有样式打包到这目录下，这个插件可以避免闪屏
      filename: "static/css/main.css",
    }),
    // 压缩css
    // new CssMinimizerPlugin(),
    // new TerserWebpackPlugin({
    //   parallel: threads, //开启多线程
    // }),
  ],
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserWebpackPlugin({
        parallel: threads, //开启多线程
      }),
      // 通过插件压缩图片，不过打包时间从3秒变成40秒
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options: {
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              // Svgo configuration here https://github.com/svg/svgo#configuration
              [
                "svgo",
                {
                  plugins: [
                    "preset-default",
                    "prefixIds",
                    {
                      name: "sortAttrs",
                      params: {
                        xmlnsOrder: "alphabetical",
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ],
  },
  //   模式
  mode: "production",
  devtool: "source-map",
};
