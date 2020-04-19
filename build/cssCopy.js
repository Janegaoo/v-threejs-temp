/*
 * @Author: Jane
 * @Date: 2020-04-18 16:46:26
 * @LastEditors: Jane
 * @LastEditTime: 2020-04-18 16:48:15
 * @Descripttion:
 */

const fs = require('fs');
const glob = require('glob');
// 读取写入删除css
const callbackFile = function(src, dst) {
  // console.log(dst)
  // console.log(src)
  // 读取css文件的具体值，拿到data
  fs.readFile(src, 'utf-8', function(error, data) {
    if (error) {
      console(error);
      return false; //  返回假值，终止
    }
    // console.log(data)
    // 把拿到的值写入到新建的CSS文件里面
    fs.writeFile(dst, data.toString(), 'utf-8', function(error) {
      if (error) {
        console.log(error);
        return false;
      }
      // console.log('CSS写入成功')
      // 删除原本的CSS文件
      fs.unlink(src, function() {});
    });
  });
};
// 拿到所有css文件，并重新构造dist目录
glob.sync('./dist/css/*.css').forEach((filepath, name) => {
  // console.log(filepath)  如./dist/css/index.a01318f8.css
  // 使用 . 为分割形成数组 如[ '', '/dist/css/index', 'a01318f8', 'css' ]
  const fileNameList = filepath.split('.');
  // 拿到数组中第一项，第一项用 / 分割，然后又拿到分割完的第三项 如index
  const fileName = fileNameList[1].split('/')[3];
  // 使用 / 为分割形成数组，拿到第三项 如index.a01318f8.css
  const copyName = filepath.split('/')[3];
  // 你想新建的目录结构 如 dist文件夹下的index文件夹下的css文件夹
  const changeDirectory = './dist/' + fileName + '/css';
  // console.log(changeDirectory)
  if (!fileName.includes('chunk-vendors')) {
    // eslint-disable-next-line node/no-deprecated-api
    // 判断路径是否已经存在
    fs.exists(changeDirectory, function(exists) {
      // exists 如果返回true说明路径存在
      if (exists) {
        console.log(fileName + '下CSS文件已经存在');
        // 存在的话直接调用函数
        callbackFile(filepath, changeDirectory + '/' + copyName);
      } else {
        // 不存在的话新建目录，目录只能一层一层建，如 dist文件夹下建立index文件夹
        fs.mkdir('./dist/' + fileName, function() {
          // 第二层目录， index文件夹下建立css文件夹
          fs.mkdir(changeDirectory, function() {
            // 调用函数
            callbackFile(filepath, changeDirectory + '/' + copyName);
            // console.log(fileName + '下CSS文件创建成功')
          });
        });
      }
    });
  }
});
