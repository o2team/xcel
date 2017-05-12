# XCEL - An Ultimate EXCEL Data Filter

XCEL 是由京东用户体验设计部 [凹凸实验室][1] 推出的一个 Excel 数据清洗工具，其通过可视化的方式让用户轻松地对 Excel 数据进行筛选。整个数据筛选处理过程利用 NodeJS 强大的异步处理功能，让你彻底告别在 Excel 里面自己写宏函数的卡顿、没响应的原始方式！

下载试用： 

 - MacOS：[点击下载][2] 
 - Windows：[64bit版本][3]  [32bit 版本][4]
 - Linux：[点击下载][5]

落地页：https://xcel.aotu.io/ ✨✨✨   
项目总结：https://aotu.io/notes/2016/11/15/xcel/ ✨✨✨

## 功能特色

1. 体验佳：该工具基于 Electron 开发，使其拥有了很多原生特性，如与系统一致的弹框、无边框设计等等。
2. 可视化：可视化操作你的 Excel 数据，支持文件的导入导出。
3. 强大的筛选逻辑：提供了单列运算逻辑、多列运算逻辑和双列范围逻辑三种筛选方式，并且可通过“且”、“或”和“编组”的方式任意组合。
4. 去重功能：提供可指定列的方式进行去重，有效避免数据冗余。

## 图示
1. 初始界面  
![初始界面][6]
2. 筛选条件面板
![筛选条件面板][7]
3. 侧边栏  
![侧边栏][8]
4. 使用说明  
![使用说明][9]
5. 应用更新
应用更新

## 模块说明

- 两个 package.json 的结构
 
 1. 对于开发（./package.json）
该 `package.json` 存在于项目的根目录。它描述了开发环境和构建命令（build scripts），即 `devDependencies`。

 2. 对于应用
该 `package.json` 存在于 `app` 目录下。它描述了应用的依赖（即 `depencencies`）。只有该目录是最终会被打包生成程序。

## 运行环境

XCEL 推荐使用 node v6.x 作为编译运行环境。另外，构建工具使用了 Webpack。

## 构建步骤
该项目是基于 [electron-vue][10] 开发，该模板的更多信息可以 [点击这里][11] 查看。
```
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron app for production
npm run build

# run webpack in production
npm run pack
```

更多构建信息可点击 [这里][12] 查看。

## 初始化项目时可能会遇到的问题

- 安装 electron 包过慢（国内情况）的解决方法：
 - 临时方式：
 `DEBUG=* ELECTRON_MIRROR="https://npm.taobao.org/mirrors/electron/" npm install electron`    
加入DEBUG=*是为了查看调试信息，确认下载源是否替换成功。
 - 永久方式：给环境变量文件(.zshrc/.bashrc)加入环境变量值（前者对应zsh，后者是bash，根据自己的实际情况）
 `export ELECTRON_MIRROR="https://npm.taobao.org/mirrors/electron/"`   
另外某些情况下会出现安装包下载不完整导致electron安装失败的原因，可以尝试清除electron缓存。  
缓存的默认地址在：``$HOME/.electron``   
通过添加ELECTRON_CUSTOM_DIR可以自定义缓存目录，方法同上。
- node-sass
```
ERROR in dlopen(/Users/**/Desktop/XCel/node_modules/node-sass/vendor/darwin-x64-48/binding.node, 1): no suitable image found.  Did find:
            /Users/**/Desktop/XCel/node_modules/node-sass/vendor/darwin-x64-48/binding.node: truncated mach-o error: segment __TEXT extends to 1212416 which is past end of file 260668
          @ ./~/vue-style-loader!./~/css-loader!./~/vue-loader/lib/style-rewriter.js!./~/sass-loader!./~/vue-loader/lib/selector.js?type=style&index=0!./app/src/App.vue 4:14-240 13:2-17:4 14:20-246
```

解决方法：`npm rebuild node-sass`

如果你还遇到其他构建问题，欢迎反馈，我会及时更新到此处。

## 最后
欢迎大家下载试用，当然更希望你们推荐给有需要的人。如果该工具没涵盖到你的筛选需求，可以进行反馈，我们会根据情况适时增加进来。   

---

## 一些有助于理解程序的图片

1. Vue 组件结构
  ![Vue 组件结构][13]
2. Vuex 数据结构
  ![Vuex 数据结构][14]
3. 解析 Excel 后的数据结构（在 background process 中）
  ![解析 Excel 后的数据结构][15]
4. 项目的文件结构
  ![项目的文件结构][16]


[1]: https://aotu.io/
  [2]: http://jdc.jd.com/lab/xcel/download/1.3.1/xcel-1.3.1.dmg
  [3]: http://jdc.jd.com/lab/xcel/download/1.3.1/xcel%20Setup%201.3.1.exe
  [4]: http://jdc.jd.com/lab/xcel/download/1.3.1/xcel%20Setup%201.3.1-ia32.exe
  [5]: http://jdc.jd.com/lab/xcel/download/1.3.1/xcel-1.3.1-linux-x64.zip
  [6]: https://misc.aotu.io/JChehe/2016-11-15-xcel/graphic11.png
  [7]: https://misc.aotu.io/JChehe/2016-11-15-xcel/graphic22.png
  [8]: https://misc.aotu.io/JChehe/2016-11-15-xcel/graphic33.png
  [9]: https://misc.aotu.io/JChehe/2016-11-15-xcel/graphic44.png
  [10]: https://github.com/SimulatedGREG/electron-vue
  [11]: https://simulatedgreg.gitbooks.io/electron-vue/content/index.html
  [12]: https://simulatedgreg.gitbooks.io/electron-vue/content/docs/npm_scripts.html
  [13]: https://misc.aotu.io/JChehe/2016-11-15-xcel/component-structure.jpg
  [14]: https://misc.aotu.io/JChehe/2016-11-15-xcel/vuex-data-structure.jpg
  [15]: https://misc.aotu.io/JChehe/2016-11-15-xcel/excel-data-analysis.jpg
  [16]: https://misc.aotu.io/JChehe/2016-11-15-xcel/file-structure.jpg
