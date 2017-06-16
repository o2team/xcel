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
3. 历史文件列表  
![历史文件列表][8]
4. 使用说明  
![使用说明][9]
5. 应用更新
![应用更新][10]

## 模块说明

- 两个 package.json 的结构
 
 1. 对于开发（./package.json）
该 `package.json` 存在于项目的根目录。它描述了开发环境和构建命令（build scripts），即 `devDependencies`。

 2. 对于应用
该 `package.json` 存在于 `app` 目录下。它描述了应用的依赖（即 `depencencies`）。只有该目录是最终会被打包生成程序。

## 运行环境

XCEL 推荐使用 node v6.x 作为编译运行环境。另外，构建工具使用了 Webpack。

## 构建步骤
该项目是基于 [electron-vue][11] 开发，该模板的更多信息可以 [点击这里][12] 查看。
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

更多构建信息可点击 [这里][13] 查看。

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

## License

[GPL](https://github.com/o2team/xcel/blob/master/LICENSE)

---

## 一些有助于理解程序的图例

1. Vue 组件结构  
  ![Vue 组件结构][14]  
2. Vuex 数据结构  
  ![Vuex 数据结构][15]  
3. 解析 Excel 后的数据结构（在 Background Process 中）  
  ![解析 Excel 后的数据结构][16]  
4. 项目的文件结构  
```
.  
├── README.md  
├── app················································应用的代码目录  
│   ├── crashTempate.js································应用崩溃时提交的日志信息  
│   ├── dist···········································应用构建后的代码目录  
│   │   ├── background·································  
│   │   │   ├── excelUtils.js··························  
│   │   │   ├── filterUtils.js·························  
│   │   │   ├── generateHTMLString.js··················  
│   │   │   ├── index.html·····························  
│   │   │   └── index.js·······························  
│   │   └── update·····································  
│   │       ├── index.css······························  
│   │       ├── index.html·····························  
│   │       └── index.js·······························  
│   ├── electron.js····································electron 入口文件（Main Process）  
│   ├── icons··········································electron-packager 打包时所需的应用图标  
│   │   ├── icon.icns··································.icns <--> OSX  
│   │   ├── icon.ico···································.ico  <--> Windows  
│   │   └── icon.png···································.png  <--> 可选项  
│   ├── ipcMainSets.js·································IPC通讯：主进程  
│   ├── main.ejs·······································页面入口  
│   ├── menuTemplate.js································应用的菜单栏  
│   ├── node_modules···································应用层级的 node_modules  
│   ├── package.json···································应用层级的 package.json（如 Lodash）  
│   └── src············································Vue 相关的目录   
│       ├── App.vue····································单页面的主结构  
│       ├── api········································所有 API 请求（目前为空）  
│       ├── background·································Backgroud Process（Renderer Process）用于处理耗时的操作  
│       │   ├── excelUtils.js··························excel 相关的工具函数集合  
│       │   ├── filterUtils.js·························过滤相关的工具函数集合  
│       │   ├── generateHTMLString.js··················根据excel数据生成相应的 HTML 字符串  
│       │   ├── index.html·····························Background Process 入口文件  
│       │   └── index.js·······························Background Process 入口 JavaScript 文件  
│       ├── components·································组件目录  
│       │   ├── FirstScreenPageView····················首屏的组件目录  
│       │   │   ├── ColSelDialog.vue···················列选择弹框组件  
│       │   │   ├── ExcelDisplay.vue···················Excel 展示组件  
│       │   │   ├── FilterForUnique.vue················去重逻辑表单组件  
│       │   │   ├── FilterFormDoubleColsRange.vue······双列范围逻辑表单组件  
│       │   │   ├── FilterFormMultiCalc.vue············多列运算逻辑表单组件  
│       │   │   ├── FilterFormSingleLogic.vue··········单列运算逻辑表单组件  
│       │   │   ├── FilterPanel.vue····················过滤面板组件  
│       │   │   ├── FilterTag.vue······················过滤标签组件  
│       │   │   ├── FilterTagList.vue··················过滤标签列组件  
│       │   │   ├── GroupSelect.vue····················组别选择组件  
│       │   │   ├── SheetOfExcel.vue···················Excel 的 sheet 组件  
│       │   │   └── uniqueTag.vue······················去重逻辑表单组件  
│       │   ├── FirstScreenPageView.vue················首屏页面结构组件  
│       │   ├── InstructionsPageView···················使用说明组件目录  
│       │   │   ├── Instructions.vue···················使用说明组件  
│       │   │   └── assets·····························静态资源  
│       │   │       └── qrcode.jpg·····················二维码图片  
│       │   ├── InstructionsPageView.vue···············使用说明页面结构   
│       │   ├── assets·································静态资源   
│       │   │   ├── O2-icon.png························O2 图标   
│       │   │   ├── common.scss························通用 CSS 样式   
│       │   │   ├── content.scss·······················使用说面页面的 CSS 样式   
│       │   │   ├── markdown.scss······················markdown 的 CSS 样式   
│       │   │   ├── o2logo.png·························O2 logo  
│       │   │   ├── select.scss························下拉选择框的 CSS 样式  
│       │   │   ├── svg································SVG 图标目录  
│       │   │   ├── table.scss·························table 相关的 CSS 样式  
│       │   │   ├── tabs.scss··························Excel 的 Tabs(sheets) CSS 样式  
│       │   │   └── xcel_logo.png······················xcel Logo  
│       │   └── common·································可复用的组件目录  
│       │       ├── FileList.vue·······················文件列表组件  
│       │       ├── Footer.vue·························底部组件  
│       │       ├── Header.vue·························头部组件  
│       │       ├── Loading.vue························文件处理时的 Loading 组件  
│       │       ├── SideBar.vue························侧边栏组件  
│       │       ├── UpdateDialog.vue···················应用更新弹框组件  
│       │       └── WindowTop.vue······················顶部控制条组件  
│       ├── main.js····································Vue 入口文件  
│       ├── routes.js··································Vue 路由文件  
│       ├── store······································Vuex 数据目录  
│       │   ├── actions.js·····························涉及多个 mutations 的 action 集合  
│       │   ├── getters.js·····························涉及多个 mutations 的 getter 集合  
│       │   ├── index.js·······························Vuex 入口文件   
│       │   ├── modules································模块目录  
│       │   │   ├── clientUpdate.js····················应用更新相关的模块  
│       │   │   ├── excel.js···························Excel 相关的模块  
│       │   │   ├── file.js····························文件相关的模块  
│       │   │   ├── filter.js··························过滤相关的模块  
│       │   │   ├── programWindow.js···················应用窗口的控制模块（如最大化、最小化）  
│       │   │   └── unique.js··························去重相关的模块  
│       │   └── mutation-types.js······················mutation-types 声明  
│       ├── update·····································应用更新的页面（Renderer Procss）  
│       │   ├── index.css······························  
│       │   ├── index.html·····························  
│       │   └── index.js·······························  
│       └── utils······································工具函数目录  
│           ├── ExcelSet.js····························Excel 相关的工具函数  
│           ├── appInfo.js·····························应用相关的信息  
│           ├── localStorageSet.js·····················本地存储的工具函数  
│           └── openExternal.js························通过默认浏览器打开外链的工具函数  
├── build··············································electron-builder 生成安装包时所需文件（如图标、背景图）  
│   ├── background.png·································Mac 安装时显示的背景图  
│   ├── icon.icns······································OSX 应用图标  
│   ├── icon.ico·······································  
│   ├── install-spinner.gif····························Windons 安装时显示的 GIF 动画  
│   ├── installerHeader································  
│   └── installerHeaderIcon.ico························  
├── builds·············································electron-packager 打包出来的各平台应用  
│   ├── XCel-darwin-x64································macOS 64位  
│   ├── XCel-linux-ia32································Linux 32位  
│   ├── XCel-linux-x64·································Liunx 64位  
│   ├── XCel-mas-x64···································苹果应用商店（Mac App Store）的 安装包  
│   ├── XCel-win32-ia32································Windows 32位  
│   └── XCel-win32-x64·································windows 64位  
├── config.js··········································Electron 构建时的配置文件  
├── node_modules·······································Electron 层级的 node_modules  
├── package.json·······································Electron 层级的 package.json  
├── tasks··············································预定义的任务集（如快速新建 Vue 组件等）  
│   ├── release.js·····································  
│   ├── runner.js······································  
└── webpack.config.js··································webpack 配置文件  
```


  [1]: https://aotu.io/
  [2]: http://jdc.jd.com/lab/xcel/download/1.4.0/xcel-1.4.0.dmg
  [3]: http://jdc.jd.com/lab/xcel/download/1.4.0/xcel%20Setup%201.4.0.exe
  [4]: http://jdc.jd.com/lab/xcel/download/1.4.0/xcel%20Setup%201.4.0-ia32.exe
  [5]: http://jdc.jd.com/lab/xcel/download/1.4.0/xcel-1.4.0-linux-x64.zip
  [6]: https://misc.aotu.io/JChehe/xcel/initial_interface.png
  [7]: https://misc.aotu.io/JChehe/xcel/filter_panel.png
  [8]: https://misc.aotu.io/JChehe/xcel/sidebar.png
  [9]: https://misc.aotu.io/JChehe/xcel/instructions_for_use.png
  [10]: https://misc.aotu.io/JChehe/xcel/app_update.png
  [11]: https://github.com/SimulatedGREG/electron-vue
  [12]: https://simulatedgreg.gitbooks.io/electron-vue/content/index.html
  [13]: https://simulatedgreg.gitbooks.io/electron-vue/content/docs/npm_scripts.html
  [14]: https://misc.aotu.io/JChehe/xcel/component_structure.png
  [15]: https://misc.aotu.io/JChehe/xcel/data_structure.png
  [16]: https://misc.aotu.io/JChehe/xcel/excel.png
  [17]: https://misc.aotu.io/JChehe/2016-11-15-xcel/file-structure.jpg
