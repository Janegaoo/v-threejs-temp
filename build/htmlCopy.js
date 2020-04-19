/*
 * @Author: Jane
 * @Date: 2020-04-18 16:49:29
 * @LastEditors: Jane
 * @LastEditTime: 2020-04-18 16:50:10
 * @Descripttion:
 */
const fs = require('fs');
const glob = require('glob');
const callbackFile = function(src, dst) {
  // console.log(dst)
  // console.log(src)
  // 读取
  fs.readFile(src, 'utf-8', function(error, data) {
    if (error) {
      console.log('读取报错');
      console(error);
      return false; //  返回假值，终止
    }
    fs.writeFile(dst, data.toString(), 'utf-8', function(error) {
      if (error) {
        console.log('写入错误');
        console.log(error);
        return false;
      }
      console.log('html写入成功');
      // 删除html
      fs.unlink(src, function() {
        // 删除全本目录的html成功
      });
    });
  });
};
glob.sync('./dist/*.html').forEach((filepath, name) => {
  const fileNameList = filepath.split('.');
  const fileName = fileNameList[1].split('/')[2];
  const copyName = filepath.split('/')[2];
  const changeDirectory = './dist/' + fileName;
  console.log('filepath' + filepath);
  console.log('copyName' + copyName);
  console.log('fileName' + fileName);
  fs.exists(changeDirectory, function(exists) {
    // exists 如果返回true说明路径存在
    if (exists) {
      // console.log(fileName + '下html文件已经存在')
      callbackFile(filepath, changeDirectory + '/' + copyName);
    } else {
      fs.mkdir(changeDirectory, function() {
        callbackFile(filepath, changeDirectory + '/' + copyName);
        // console.log(fileName + '下html文件创建成功')
      });
    }
  });
});
