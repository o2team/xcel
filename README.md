# XCel

> An ultimate excel data filter

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron app for production
npm run build

# run webpack in production
npm run pack
```

More information can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/docs/npm_scripts.html).

---

This project was generated from [electron-vue](https://github.com/SimulatedGREG/electron-vue) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about this project can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).

## Initialize the project may encounter problems
```
ERROR in dlopen(/Users/**/Desktop/XCel/node_modules/node-sass/vendor/darwin-x64-48/binding.node, 1): no suitable image found.  Did find:
         	/Users/**/Desktop/XCel/node_modules/node-sass/vendor/darwin-x64-48/binding.node: truncated mach-o error: segment __TEXT extends to 1212416 which is past end of file 260668
          @ ./~/vue-style-loader!./~/css-loader!./~/vue-loader/lib/style-rewriter.js!./~/sass-loader!./~/vue-loader/lib/selector.js?type=style&index=0!./app/src/App.vue 4:14-240 13:2-17:4 14:20-246

```
What fixed it for me was the following:
```
npm rebuild node-sass
```


## Speed up the installation of electron in China

### 临时方式

```
DEBUG=* ELECTRON_MIRROR="https://npm.taobao.org/mirrors/electron/" npm install electron
```

加入DEBUG=*是为了查看调试信息，确认下载源是否替换成功。

### 永久方式

给环境变量文件(.zshrc/.bashrc)加入环境变量值（前者对应zsh，后者是bash，自己看情况）

```
export ELECTRON_MIRROR="https://npm.taobao.org/mirrors/electron/"
```

另外某些情况下会出现安装包下载不完整导致electron安装失败的原因，可以尝试清除electron缓存。

缓存的默认地址在:

```
$HOME/.electron
```
通过添加ELECTRON_CUSTOM_DIR可以自定义缓存目录，方法同上。