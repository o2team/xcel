const shortid = require('shortid')
const xlsx = require('xlsx')
const path = require('path')
const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const dialog = electron.dialog
const ipcMain = electron.ipcMain
const shell = electron.shell
let savePath = ''
const downloadsPath = app.getPath('downloads')
let updateWindow
let updateItem
let downloadsFullPath

shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@')

module.exports = function (mainWindow, backgroundWindow) {
  ipcMain.on('will-download-handler', (ipcEvent, arg) => {
    if (!updateWindow || updateWindow.isDestroyed()) {
      updateWindow = createUpdateWindow()
    }
    if (!updateWindow.isDestroyed()) {
      updateWindow.webContents.session.removeAllListeners()
      updateWindow.webContents.session.on('will-download', (event, item, webContents) => {
        updateItem = item
        downloadsFullPath = downloadsPath + item.getFilename()
        item.setSavePath(downloadsFullPath)
        console.log(downloadsFullPath)
        console.log('getTotalBytes', item.getTotalBytes())
        item.on('updated', (event, state) => {
          if (state === 'interrupted') {
            console.log('Download is interrupted but can be resumed')
          } else if (state === 'progressing') {
            if (item.isPaused()) {
              console.log('Download is paused')
            } else {
              console.log(`Received bytes: ${item.getReceivedBytes()}`)
            }
          }
          if (!updateWindow.isDestroyed()) {
            updateWindow.webContents.send('will-download-response', {
              curReceivedBytes: item.getReceivedBytes(),
              totalBytes: item.getTotalBytes(),
              downloadStatus: state
            })
          }
        })

        item.once('done', (event, state) => {
          if (state === 'completed') {
            console.log('Download successfully')
            if (!shell.openItem(downloadsFullPath)) {
              shell.showItemInFolder(downloadsPath)
            }
            if (!updateWindow.isDestroyed()) {
              updateWindow.close()
            }
          } else {
            console.log(`Download failed: ${state}`)
          }
          item.removeAllListeners()
          updateItem = null
          item = null
        })
      })
      console.log('uodate.url', arg.url)
      if (process.env.NODE_ENV === 'development') {
        updateWindow.webContents.downloadURL(arg.url)
      } else {
        updateWindow.webContents.downloadURL(arg.url)
      }
    }
  })
  function createUpdateWindow () {
    const win = new BrowserWindow({
      height: 160,
      width: 550,
      minWidth: 550,
      minHeight: 160,
      title: '下载最新版的XCel',
      backgroundColor: '#f5f5f5'
    })
    win.loadURL(`file://${__dirname}/dist/update/index.html`)
    win.once('closed', closeUpdateWindow)
    return win
  }
  function closeUpdateWindow (event) {
    console.log(updateItem)
    if (updateItem) {
      updateItem.removeAllListeners()
      updateItem.cancel() // cancel 后，DownloadItem 就是 null 了
      updateItem = null
    }
  }
  ipcMain.on('update-switch', (event, arg) => {
    if (updateItem) {
      let status = ''
      if (updateItem.isPaused()) {
        if (updateItem.canResume()) {
          updateItem.resume()
          status = '暂停'
        }
      } else {
        updateItem.pause()
        status = '继续'
      }
      event.sender.send('update-switch-response', {
        text: status
      })
    }
  })

  ipcMain.on('update-cancel', (event, arg) => {
    if (updateItem) {
      updateItem.removeAllListeners()
      updateItem.cancel()
      updateWindow.close()
      updateItem = null
    }
  })

  ipcMain.on('update-checkout', (event, arg) => {
    if (updateItem) {
      updateItem.cancel()
      shell.openExternal('https://xcel.aotu.io/')
      updateWindow.close()
      updateItem = null
    }
  })

  ipcMain.on('readFile-response', (event, arg) => {
    console.log('触发readFile-response')
    mainWindow.webContents.send('readFile-response', arg)
  })
  ipcMain.on('readFile-start', (event, arg) => {
    console.log('读取文件emit')
    savePath = getSavePath(arg.data.path)
    console.log(savePath)
    backgroundWindow.webContents.send('readFile-start', arg)
  })

  ipcMain.on('generate-htmlstring-response', (event, arg) => {
    mainWindow.webContents.send('generate-htmlstring-response', arg)
  })

  ipcMain.on('filter-response', (event, arg) => {
    mainWindow.webContents.send('filter-response', arg)
  })
  ipcMain.on('filter-start', (event, arg) => {
    backgroundWindow.webContents.send('filter-start', arg)
  })

  ipcMain.on('changeTab-start', (event, arg) => {
    backgroundWindow.webContents.send('changeTab-start', arg)
  })

  ipcMain.on('exportFile-response', (event, arg) => {
    mainWindow.webContents.send('exportFile-response', arg)
  })
  ipcMain.on('exportFile-start', (event, arg) => {
    backgroundWindow.webContents.send('exportFile-start', arg)
  })

  ipcMain.on('delAllFilterTag-start', (event, arg) => {
    backgroundWindow.webContents.send('delAllFilterTag-start', arg)
  })

  ipcMain.on('sync-openFile-dialog', (event, arg) => {
    dialog.showOpenDialog({
      title: '请选择Excel文件',
      filters: [{ name: 'Excel File', extensions: ['xls', 'xlsx'] }],
      properties: ['openFile']
    }, function (arr) {
      if (typeof arr !== 'undefined') {
        // arr 是一个文件路径 数组
        // console.log("event", event)
        // 正常触发
        if (event) {
          event.sender.send('open-file-response', arr[0])
        } else {
          // 通过 emit 触发（如快捷键）
          const mainWindow = BrowserWindow.fromId(1)
          if (mainWindow) {
            mainWindow.webContents.send('open-file-response', arr[0])
          }
        }
      }
    })
  })

  ipcMain.on('sync-saveFile-dialog', (event, arg) => {
    console.log('sync-saveFile-dialog')
    dialog.showSaveDialog({
      title: '请选择保存路径',
      defaultPath: savePath,
      filters: [{
        name: 'Excel',
        extensions: ['xlsx']
      }]
    }, function (p) {
      if (typeof p !== 'undefined') {
        xlsx.writeFile(arg.data, p)
      }
      // p 是用户输入的路径名
      console.log('p', p)
    })
  })

  ipcMain.on('sync-alert-dialog', (event, arg) => {
    dialog.showMessageBox({
      type: 'warning',
      buttons: ['确定'],
      defaultId: 0, // dialog 打开是默认选中哪个按钮
      title: arg.title || 'xcel',
      message: arg.content || '',
      detail: arg.detail || ''
    })
  })

  // 接受窗口的最小化、最大化、关闭 事件
  ipcMain.on('sync-close', (event, arg) => {
    mainWindow.close()
  })
  ipcMain.on('sync-maximize', (event, arg) => {
    let windowBounds = {
      width: 1280,
      height: 850
    }
    if (mainWindow.isMaximized()) {
      mainWindow.setBounds(windowBounds)
    } else {
      windowBounds = mainWindow.getBounds()
      mainWindow.maximize()
    }
    event.sender.send('send-isMax', mainWindow.isMaximized())
  })
  ipcMain.on('sync-minimize', (event, arg) => {
    if (!mainWindow.isMinimized()) {
      mainWindow.minimize()
      console.log('可以最小化')
    } else {
      console.log('不可最小化，因为已经最小化了')
    }
  })
}

function getSavePath (uPath) {
  const file = path.parse(uPath)
  return path.join(file.dir, `${file.name}-${shortid.generate()}${file.ext}`)
}
