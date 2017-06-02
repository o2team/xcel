const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain

const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Open File',
        accelerator: 'CmdOrCtrl+O',
        click (item, focusedWindow) {
          ipcMain.emit('sync-openFile-dialog')
        }
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click (item, focusedWindow) {
          Array.prototype.forEach.call(BrowserWindow.getAllWindows(), (win, i) => {
            win.reload()
          })
        }
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: (function () {
          if (process.platform === 'darwin') {
            return 'Alt+Command+I'
          }
          return 'Ctrl+Shift+I'
        })(),
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.toggleDevTools()
        }
      },
      {
        label: 'Toggle Background Renderer',
        accelerator: (function () {
          if (process.platform === 'darwin') {
            return 'Alt+Command+B'
          }
          return 'Ctrl+Shift+B'
        })(),
        click (item, focusedWindow) {
          const backWin = BrowserWindow.fromId(2)
          if (backWin.isVisible()) {
            backWin.hide()
          } else {
            backWin.show()
            backWin.focus()
          }
        }
      }
    ]
  },
  {
    label: 'Help',
    role: 'help'/*,
    submenu: [
      {
        label: 'Learn More',
        click: function () { require('electron').shell.openExternal('http://electron.atom.io') }
      }
    ] */
  }
]

if (process.platform === 'darwin') {
  const name = electron.app.getName()
  console.log('appname', name)
  template.unshift({
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo'
      },
      {
        label: 'Redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall'
      }
    ]
  })
  template.unshift({
    label: name,
    submenu: [
      {
        label: `About ${name}`,
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        label: 'Services',
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        label: `Hide ${name}`,
        accelerator: 'Command+H',
        role: 'hide'
      },
      {
        label: 'Hide Others',
        accelerator: 'Command+Alt+H',
        role: 'hideothers'
      },
      {
        label: 'Show All',
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click () { electron.app.quit() }
      }
    ]
  })
  template.unshift()
}

module.exports = template
