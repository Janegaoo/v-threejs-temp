/*
 * @Author: Jane
 * @Date: 2020-04-14 17:28:54
 * @LastEditors: Jane
 * @LastEditTime: 2020-04-16 17:10:02
 * @Descripttion:
 */

const utils = require('./build/utils'); // 生成入口文件对象
// const prodConfig = require('./build/webpack.prod.conf'); // 生产配置
// const devConfig = require('./build/webpack.dev.config'); // 开发模式配置
const productionMode = process.env.NODE_ENV === 'production';
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin'); // 用terser-webpack-plugin替换掉uglifyjs-webpack-plugin解决uglifyjs不支持es6语法问题

const path = require('path');
const env = process.env.NODE_ENV;
let target = process.env.VUE_APP_URL;

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  pages: utils.getEntries(),
  publicPath: '/', // 默认'/'，部署应用包时的基本 URL
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'dev',
  productionSourceMap: false,
  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?
    sourceMap: true,
    // css预设器配置项
    loaderOptions: {},
    // 启用 CSS modules for all css / pre-processor files.
    requireModuleExtension: false
  },
  devServer: {
    port: process.env.port || 8080,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      // change xxx-api/login => mock/login
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      [process.env.VUE_APP_BASE_API]: {
        target: 'http://172.169.1.241:29000',
        changeOrigin: true,
        pathRewrite: {
          [`^${process.env.VUE_APP_BASE_API}`]: '',
        },
      }
    }
    // after: require('./mock/mock-server.js')
  },
  configureWebpack: config => {
    // 后缀省略
    config.resolve.extensions = ['.js', '.ts', '.vue', '.json', '.css', '.scss'];
    config.plugins.push(
      new CopyWebpackPlugin([{ from: 'static/', to: 'static' }])
    );
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // Must be set to true if using source-maps in production
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true
          }
        }
      });
    } else {
      // 为开发环境修改配置...
    }
  },
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = false;
        return options;
      });
    config.resolve.alias
      .set('vue$', 'vue/dist/vue.esm.js')
      .set('@', resolve('src'));
  }
};
