// 由于 Electron 的 main 和 renderer 进程的限制，目前该模块仅用于 renderer 进程。

import { remote } from 'electron'
import os from 'os'
import path from 'path'
import packageJSON from '../../package.json'


// dev 时显示了 app.getName()、app.getVersion()都返回Electron的信息，但打包后正常
let app = remote.app,
		isDev = process.env.NODE_ENV === 'development',
		app_version = isDev ? packageJSON.version : app.getVersion(),
		name = isDev ? packageJSON.name : app.getName(),
		platform = os.platform() + '_' + os.arch(),
		updateUrl = isDev ? 'http://localhost:5000/update/'+platform+'/'+app_version
											: 'http://localhost:5000/update/'+platform+'/'+app_version

export const appInfo = {
	platform,
	name,
	app_version,
	ele_version: process.versions.electron, // electron 版本
	chrome_version: process.versions.chrome, // chrome 版本
	locales: app.getLocale(), // 本地化
	updateUrl
}
