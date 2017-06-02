// 由于 Electron 的 main 和 renderer 进程的限制，目前该模块仅用于 renderer 进程。

import { remote } from 'electron'
import os from 'os'
import packageJSON from '../../package.json'

const UPDATE_HOST = 'http://nuts-xcel.aotu.io/'
const UPDATE_HOST_DEV = 'http://nuts-xcel.aotu.io/'

const DOWNLOAD_HOST = 'http://jdc.jd.com/lab/xcel/download/'

// dev 时显示了 app.getName()、app.getVersion()都返回Electron的信息，但打包后正常
const app = remote.app
const isDev = process.env.NODE_ENV === 'development'
const appVersion = isDev ? packageJSON.version : app.getVersion()
const name = isDev ? packageJSON.name : app.getName()
const platform = os.platform()
const arch = os.arch()
const updateUrl = isDev ?
                   `${UPDATE_HOST_DEV}update/${platform}_${arch}/${appVersion}` :
                   `${UPDATE_HOST}update/${platform}_${arch}/${appVersion}`

export const appInfo = {
  platform,
  name,
  app_version: appVersion,
  ele_version: process.versions.electron, // electron 版本
  chrome_version: process.versions.chrome, // chrome 版本
  locales: app.getLocale(), // 本地化
  updateUrl,
  downloadUrl: DOWNLOAD_HOST
}

export function getDownloadUrl (version) {
  const prefix = `${DOWNLOAD_HOST}${version}/`
  if (platform === 'darwin') {
    return `${prefix}${name}-${version}.dmg`
  } else if (platform === 'win32') {
    if (arch === 'ia32' || arch === 'x86') {
      return `${prefix}${name} Setup ${version}-ia32.exe`
    } else if (arch === 'x64') {
      return `${prefix}${name} Setup ${version}.exe`
    }
  } else if (platform === 'linux') {
    if (arch === 'ia32' || arch === 'x86') {
      return `${prefix}${name}-${version}-linux-ia32.zip`
    } else if (arch === 'x64') {
      return `${prefix}${name}-${version}-linux-x64.zip`
    }
  }
}
