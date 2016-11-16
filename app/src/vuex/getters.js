// 文件列表相关
export function getUploadFiles(state) {
	return state.fileList.fileList
}
export function getCurSearchVal(state) {
	return state.fileList.curSearchVal
}	
export function getFileStatus(state) {
	return state.fileList.fileStatus
}

// 过滤 Excel 数据相关
export function getFilterOptions(state) {
	return state.filterList.filterOptions
}
export function getSheetNameList(state) {
	return state.filterList.sheetNameList
}
// 有问题， 没区分多表
export function getActiveSheet(state) {
	return state.filterList.activeSheet
}
export function getFilterTagList(state) {
	return state.filterList.filterTagList
}

export function getFilterWay(state) {
	return state.filterList.filterWay
}
export function getFilterPanelStatus(state) {
	return state.filterList.isShowFillterPanel
}

export function getCurOriRowCount(state) {
	let curSheetName = state.filterList.activeSheet.name
	return state.filterList.oriRow[curSheetName] || 0
}

export function getCurFilRowCount(state) {
	let curSheetName = state.filterList.activeSheet.name
	return state.filterList.filRow[curSheetName] || 0
}

export function getCurColCount(state) {
	let curSheetName = state.filterList.activeSheet.name
	return state.filterList.colKeys[curSheetName] && state.filterList.colKeys[curSheetName].length || 0
}

export function getCurFilterTagListCount(state) {
	let curSheetName = state.filterList.activeSheet.name
	return state.filterList.filterTagList[curSheetName] && state.filterList.filterTagList[curSheetName].length || 0
}
export function getCurColKeys(state) {
	let curSheetName = state.filterList.activeSheet.name
	return state.filterList.colKeys[curSheetName]
}

export function getColSelectDialogStatus(state) {
	return state.filterList.isShowColSelectDialog
}

export function getColSelectType(state) {
	return state.filterList.colSelectType
}

export function getColSelectVal(state) {
	return state.filterList.colSelectVal
}
// 其他
export function getSideBarStatus(state) {
	return state.fileList.isShowSideBar
}
