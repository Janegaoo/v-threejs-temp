/*
 * @Author: Jane
 * @Date: 2020-04-18 16:48:28
 * @LastEditors: Jane
 * @LastEditTime: 2020-04-18 16:49:21
 * @Descripttion: 
 */
const fs = require('fs');
const glob = require('glob');
const callbackFile = function(src, dst) {
  // console.log(src)
  // 读取js里面的data
  fs.readFile(src, 'utf-8', function(error, data) {
    if (error) {
      console.log('读取报错');
      console(error);
      return false; //  返回假值，终止
    }
    // 写入js dst为新建的路径
    // console.log(data)
    // console.log(dst)
    fs.writeFile(dst, data.toString(), 'utf-8', function(error) {
      if (error) {
        console.log('写入报错');
        console.log(error);
        return false;
      }
      // console.log('js写入成功')
      // 删除原来的js
      fs.unlink(src, function() {});
    });
  });
};
// 复制目录
glob.sync('./dist/js/*.js').forEach((filepath, name) => {
  const fileNameList = filepath.split('.');
  const fileName = fileNameList[1].split('/')[3];
  const copyName = filepath.split('/')[3];
  const changeDirectory = './dist/' + fileName + '/js'; // 多页面JS文件地存放址
  // console.log(fileName)
  // console.log(changeDirectory)
  if (!fileName.includes('chunk-vendors')) {
    // eslint-disable-next-line
    fs.exists(changeDirectory, function(exists) {
      // exists 如果返回true说明路径存在
      if (exists) {
        // console.log(fileName + '下JS文件已经存在')
        callbackFile(filepath, changeDirectory + '/' + copyName);
      } else {
        fs.mkdir('./dist/' + fileName, function() {
          fs.mkdir(changeDirectory, function() {
            callbackFile(filepath, changeDirectory + '/' + copyName);
            // console.log(fileName + '下JS文件创建成功')
          });
        });
      }
    });
  }
});
