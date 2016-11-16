const shortid = require('shortid')
const xlsx = require('xlsx')
const path = require('path')
const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const dialog = electron.dialog
const ipcMain = electron.ipcMain
let savePath = ''

shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@')

module.exports = function(mainWindow, backgroundWindow) {

	ipcMain.on("readFile-response", (event, arg) => {
		console.log("触发readFile-response")
	  mainWindow.webContents.send("readFile-response", arg)
	})
	ipcMain.on("readFile-start", (event, arg) => {
	  console.log("读取文件emit")
	  savePath = getSavePath(arg.data.path)
	  console.log(savePath)
	  backgroundWindow.webContents.send("readFile-start", arg)
	})

	ipcMain.on("generate-htmlstring-response", (event, arg) => {
		mainWindow.webContents.send("generate-htmlstring-response", arg)
	})

	ipcMain.on("filter-response", (event, arg) => {
	  mainWindow.webContents.send("filter-response", arg)
	})
	ipcMain.on("filter-start", (event, arg) => {
	  backgroundWindow.webContents.send("filter-start", arg)
	})

	ipcMain.on("changeTab-start", (event, arg) => {
		backgroundWindow.webContents.send("changeTab-start", arg)
	})

	ipcMain.on("exportFile-response", (event, arg) => {
	  mainWindow.webContents.send("exportFile-response", arg)
	})
	ipcMain.on("exportFile-start", (event, arg) => {
	  backgroundWindow.webContents.send("exportFile-start", arg)
	})

	ipcMain.on("delAllFilterTag-start", (event, arg) => {
		backgroundWindow.webContents.send("delAllFilterTag-start", arg)
	})

	ipcMain.on("sync-openFile-dialog", (event, arg) => {
		dialog.showOpenDialog({
			title: "请选择Excel文件",
			filters: [{name: 'Excel File', extensions: ['xls', "xlsx"]}],
			properties: ["openFile"]
		}, function(arr) {
	    if(arr !== undefined) {
				// arr 是一个文件路径 数组
				// console.log("event", event)
				// 正常触发
				if(event) {
					event.sender.send("open-file-response", arr[0])
				} 
				// 通过 emit 触发（如快捷键）
				else {
					var mainWindow = BrowserWindow.fromId(1)
					if(mainWindow) {
						mainWindow.webContents.send("open-file-response", arr[0])
					}
				}
			}
		})
	})

	ipcMain.on("sync-saveFile-dialog", (event, arg) => {
		console.log("sync-saveFile-dialog")
	  dialog.showSaveDialog({
	    title: "请选择保存路径",
	    defaultPath: savePath,
	    filters: [{
	      name: "Excel",
	      extensions: ["xlsx"]
	    }]
	  }, function(p) {
	    if(p !== undefined) {
	      xlsx.writeFile(arg.data, p)
	    }
	    // p 是用户输入的路径名
	    console.log("p" , p);
	  })
	})


	ipcMain.on("sync-alert-dialog", (event, arg) => {
	  dialog.showMessageBox({
	    type: "warning",
	      buttons: ["确定"],
	      defaultId: 0, // dialog 打开是默认选中哪个按钮
	      title: arg.title || "xcel",
	      message: arg.content || "",
	      detail: arg.detail || ""
	  })
	})

	// 接受窗口的最小化、最大化、关闭 事件
	ipcMain.on("sync-close", (event, arg) => {
	  mainWindow.close()
	})
	ipcMain.on("sync-maximize", (event, arg) => {
	  if(mainWindow.isMaximized()){
	    mainWindow.setBounds(windowBounds)
	  }else{
	    windowBounds = mainWindow.getBounds()
	    mainWindow.maximize()
	  }
	  event.sender.send("send-isMax", mainWindow.isMaximized())
	})
	ipcMain.on("sync-minimize", (event, arg) => {
	  if(!mainWindow.isMinimized()){
	    mainWindow.minimize()
	    console.log("可以最小化")
	  }else{
	    console.log("不可最小化，因为已经最小化了")
	  }
	})
}

function getSavePath(uPath) {
	var file = path.parse(uPath)
	return path.join(file.dir, file.name + '-' + shortid.generate() + file.ext)
}