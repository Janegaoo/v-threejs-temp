/*
 * @Author: Jane
 * @Date: 2020-04-14 17:28:54
 * @LastEditors: Jane
 * @LastEditTime: 2020-04-14 17:58:29
 * @Descripttion:
 */
module.exports = {
  pages: {
    page1: {
      // page 的入口
      entry: "src/views/page1/main.ts",
      // 模板来源
      template: "public/index.html",
      // 在 dist/index.html 的输出
      filename: "page1.html",
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: "page1",
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ["chunk-vendors", "chunk-common", "page1"]
    },
    page2: {
      // page 的入口
      entry: "src/views/page2/main.ts",
      // 模板来源
      template: "public/index.html",
      // 在 dist/index.html 的输出
      filename: "page2.html",
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: "page2",
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ["chunk-vendors", "chunk-common", "page2"]
    }
  }
};
