'use strict'

const electron = require('electron')
const path = require('path')
const menuTemplate = require('./menuTemplate')
const ipcMainSets = require('./ipcMainSets')
const crashTempate = require('./crashTempate')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu

let mainWindow // 主窗口
let backgroundWindow // 执行耗时运算的 背后窗口
let config = {}

if (process.env.NODE_ENV === 'development') {
  config = require('../config')
  config.mainUrl = `http://localhost:${config.port}`
} else {
  config.devtron = false
  config.mainUrl = `file://${__dirname}/dist/index.html`
}
config.backUrl = `file://${__dirname}/dist/background/index.html`
config.isDev = process.env.NODE_ENV === 'development'

function createMainWindow () {
  const win = new BrowserWindow({
    height: 850,
    width: 1280,
    minWidth: 1120,
    minHeight: 768,
    backgroundColor: '#f5f5f5',
    fullscreenable: false,
    frame: false,
    show: false
  })
  win.loadURL(config.mainUrl)

  if (config.isDev) {
    BrowserWindow.addDevToolsExtension(path.join(__dirname, '../node_modules/devtron'))

    const installExtension = require('electron-devtools-installer')

    installExtension.default(installExtension.VUEJS_DEVTOOLS)
            .then(name => win.webContents.openDevTools())
            .catch(err => console.log('An error occurred: ', err))
  }

  win.on('closed', () => {
    console.log('触发 closed')
    mainWindow = null
    backgroundWindow = null
        // 在Mac中完全退出程序，而不会留在dock中
    app.quit()
  })

  win.on('ready-to-show', () => {
    win.show()
    win.focus()
  })
  console.log('mainWindow opened')
  return win
}

function createBackgroundWindow () {
  const win = new BrowserWindow({
    show: config.isDev
  })
  win.loadURL(config.backUrl)
  console.log('backgroundWindow opened')
  return win
}

app.on('ready', () => {
  console.log('ready')
  mainWindow = createMainWindow()
  backgroundWindow = createBackgroundWindow()
  ipcMainSets(mainWindow, backgroundWindow)
  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 当应用被激活时触发，常用于点击应用的 dock 图标的时候。
// 现在取消保留在Dock中，完全退出
app.on('activate', () => {
  if (mainWindow.isDestroyed()) {
    mainWindow = createMainWindow()
    backgroundWindow = createBackgroundWindow()
  }
})

crashTempate.start()

console.log('主进程pid：', process.pid)
