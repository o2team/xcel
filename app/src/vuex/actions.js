import * as types from './mutation-types'
import { ipcRenderer } from 'electron'
import pathModule from 'path'

// 文件列表相关
export const changeFileType = ({ dispatch }, val) => {
	dispatch(types.SELECT_SEARCH_TYPE, val)
}

export const changeSearchVal = ({ dispatch }, val) => {
	dispatch(types.CHANGE_SEARCH_VALUE, val)
}
export const setUploadFiles = ({ dispatch }, path) => {
	let file = {
		path: path,
		name: pathModule.basename(path),
		extname: pathModule.extname(path)
	}
	dispatch(types.SET_UPLOAD_FILES, file)
}
export const delUploadFiles = ({ dispatch }, val) => {
	dispatch(types.DEL_UPLOAD_FILES, val)
}
export const setFileStatus = ({ dispatch }, val) => {
	dispatch(types.SET_UPLOAD_STATUS, val)
}
// 过滤Excel数据相关

// data 目前都是 path
export const setExcelData = ({ dispatch }, data) => {
	dispatch(types.SET_UPLOAD_STATUS, 0)
	ipcRenderer.send('readFile-start', {
    data: data
  })
  ipcRenderer.once('readFile-response', (event, arg) => {
  	dispatch(types.SET_EXCEL_BASE_INFO, arg)
  	dispatch(types.SET_UPLOAD_STATUS, -1)
  	dispatch(types.SET_ACTIVE_SHEET, 0)
  	dispatch(types.TOGGLE_FILTER_PANEL_STATUS, true)
  	// dispatch(types.SET_EXCEL_DATA, arg)
  	// dispatch(types.TOGGLE_SIDEBAR, true)
  })
}
export const setActiveSheet = ({ dispatch }, val) => {
	dispatch(types.SET_ACTIVE_SHEET, val)
}
export const addFilter = ({ dispatch }, val) => {
	dispatch(types.ADD_FILTER, val)
}
export const delFilter = ({ dispatch }, val) => {
	dispatch(types.DEL_FILTER, val)
}
export const setFilteredData = ({ dispatch }, val) => {
	dispatch(types.SET_FILTERED_DATA, val)
}

export const setFilterWay = ({ dispatch }, val) => {
	dispatch(types.SET_FILTER_WAY, val)
}
export const toggleFilterPanelStatus = ({ dispatch },val) => {
	dispatch(types.TOGGLE_FILTER_PANEL_STATUS, val)
}

export const setColSelectDialogStatus = ({ dispatch }, val) => {
	dispatch(types.SET_COL_SELECT_DIALOG_STATUS, val)
	dispatch(types.TOGGLE_SIDEBAR, false)
}
export const setColSelectType = ({ dispatch }, val) => {
	dispatch(types.SET_COL_SELECT_TYPE, val)
}

export const setColSelectVal = ({ dispatch }, val) => {
	dispatch(types.SET_COL_SELECT_VAL, val)
}

// 其他
export const toggleSideBar = ({ dispatch }, val) => {
	dispatch(types.TOGGLE_SIDEBAR, val)
}

// 窗口 window
export const toggleWindowMax = ({ dispatch }) => {
	dispatch(types.TOGGLE_WINDOW_MAX)
}
export const toggleWindowMini = ({ dispatch }) => {
	dispatch(types.TOGGLE_WINDOW_MINI)
}