/*
 * @Author: Jane
 * @Date: 2020-04-16 11:04:35
 * @LastEditors: Jane
 * @LastEditTime: 2020-04-16 18:25:33
 * @Descripttion:
 */

/* 这里是添加的部分 ---------------------------- 开始 */
// glob是webpack安装时依赖的一个第三方模块，还模块允许你使用 *等符号, 例如lib/*.js就是获取lib文件夹下的所有js后缀名的文件
var glob = require('glob');
const path = require('path');
// 页面模板
var HtmlWebpackPlugin = require('html-webpack-plugin');
// 取得相应的页面路径，因为之前的配置，所以是src文件夹下的pages文件夹
var PAGE_PATH = path.resolve(__dirname, '../src/views');
// 用于做相应的merge处理
var merge = require('webpack-merge');

const fs = require('fs');
var moduleRootPath = 'src/views'; //模块根目录(这个可以根据自己的需求命名)
let moduleInfo = null;

//多入口配置
// 通过glob模块读取pages文件夹下的所有对应文件夹下的js后缀文件，如果该文件存在
// 那么就作为入口处理
// exports.entries = function() {
//   var entryFiles = glob.sync(PAGE_PATH + '/*/*.ts');

//   var map = {};
//   entryFiles.forEach(filePath => {
//     console.log('======');
//     console.log(getSlashValue(filePath));
//     let filename = getSlashValue(filePath);
//     // var filename = filePath.substring(
//     //   filePath.lastIndexOf('/') + 1,
//     //   filePath.lastIndexOf('.')
//     // );
//     map[filename]['entry'] = filePath;
//     map[filename]['template'] = filePath;
//   });
//   console.log(map);
//   return map;
// };
// function getSlashValue(url) {
//   return url
//     .substr(url.lastIndexOf('/', url.lastIndexOf('/') - 1) + 1)
//     .substring(
//       0,
//       url
//         .substr(url.lastIndexOf('/', url.lastIndexOf('/') - 1) + 1)
//         .lastIndexOf('/')
//     );
// }
//多页面输出配置
// 与上面的多页面入口配置相同，读取pages文件夹下的对应的html后缀文件，然后放入数组中
exports.htmlPlugin = function() {
  let entryHtml = glob.sync(PAGE_PATH + '/*/*.html');
  let arr = [];
  entryHtml.forEach(filePath => {
    let filename = filePath.substring(
      filePath.lastIndexOf('/') + 1,
      filePath.lastIndexOf('.')
    );
    let conf = {
      // 模板来源
      template: filePath,
      // 文件名称
      filename: filename + '.html',
      // 页面模板需要加对应的js脚本，如果不加这行则每个页面都会引入所有的js脚本
      chunks: ['manifest', 'vendor', filename],
      inject: true
    };
    if (process.env.NODE_ENV === 'production') {
      conf = merge(conf, {
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
        },
        chunksSortMode: 'dependency'
      });
    }
    arr.push(new HtmlWebpackPlugin(conf));
  });
  return arr;
};

exports.getEntries = function getEntries() {
    //初始化模块列表
    this.getModuleInfo();
    console.log(
        '*********************************** entries ***********************************'
    );
    console.log(JSON.stringify(moduleInfo));
    return moduleInfo;
};
exports.getModuleInfo = function getModuleInfo() {
    //判断是否为空，不为空则直接返回
    if (moduleInfo) {
        return moduleInfo;
    } else {
        //为空则读取列表
        moduleInfo = {};
        readDirSync(moduleRootPath, '', true);
        return moduleInfo;
    }
};
/**
 * 深度遍历目录，并整理多页面模块
 * @param path 需要变量的路径
 * @param moduleName 模块名称
 */
function readDirSync(path, moduleName, nextLevel) {
    //缓存模块对象
    var moduleObj = {
        entry: '',
        template: '',
        filename: '',
        inject: true
    };
    //获取当前模块ID
    var moduleID = path.replace(moduleRootPath + '/', '');
    if (path == moduleRootPath) {
        moduleID = '';
    }
    //获取目录下所有文件及文件夹
    var pa = fs.readdirSync(path);
    pa.forEach(function(ele, index) {
        var info = fs.statSync(path + '/' + ele);
        if (info.isDirectory()) {
            // console.log("dir: "+ele)
            nextLevel && readDirSync(path + '/' + ele, ele, false);
        } else {
            //判断当前模块的html是否存在
            if ('index.html' == ele) {
                moduleObj.template = path + '/' + ele;
                moduleObj.filename = moduleID + '/' + 'index.html';
            } else {
                moduleObj.template = './public/index.html';
                moduleObj.filename = moduleID + '/' + 'index.html';
            }
            //判断当前模块的js是否存在
            if ('main.ts' == ele) {
                moduleObj.entry = path + '/' + ele;
            }
            // console.log("file: "+ele)
        }
    });
    //判断模块是否真实(可能只是个分级目录)
    if (
        (moduleObj.moduleID != '' && moduleObj.moduleHTML != '') ||
        (moduleObj.moduleID != '' && moduleObj.moduleJS != '')
    ) {
        if (moduleID) {
            moduleInfo[moduleID] = moduleObj;
        }
    }
}
// exports.getEntries();

// module.exports = {
//     getEntries: {
//         page1: {
//           // page 的入口
//           entry: 'src/views/page1/main.ts',
//           // 模板来源
//           template: 'public/index.html',
//           // 在 dist/index.html 的输出
//           filename: 'page1.html',
//           // 当使用 title 选项时，
//           // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
//           title: 'page1',
//           // 在这个页面中包含的块，默认情况下会包含
//           // 提取出来的通用 chunk 和 vendor chunk。
//           chunks: ['chunk-vendors', 'chunk-common', 'page1']
//         },
//         page2: {
//           // page 的入口
//           entry: 'src/views/page2/main.ts',
//           // 模板来源
//           template: 'public/index.html',
//           // 在 dist/index.html 的输出
//           filename: 'page2.html',
//           // 当使用 title 选项时，
//           // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
//           title: 'page2',
//           // 在这个页面中包含的块，默认情况下会包含
//           // 提取出来的通用 chunk 和 vendor chunk。
//           chunks: ['chunk-vendors', 'chunk-common', 'page2']
//         },
//         index: {
//           entry: 'src/main.ts',
//           template: 'public/index.html'
//         }
//     }
// }
