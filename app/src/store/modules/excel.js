import { ipcRenderer } from 'electron'

const state = {
    oriRow: {},
    filRow: {},
    colKeys: {},
    activeSheet: {
        index: 0,
        name: ''
    },
    sheetNameList: []
}

const getters = {
    getSheetNameList: (state, getters, rootState) => state.sheetNameList,
    getActiveSheet: (state, getters, rootState) => state.activeSheet,
    getCurOriRowCount: (state, getters, rootState) => {
        let curSheetName = rootState.excel.activeSheet.name
        return state.oriRow[curSheetName] || 0
    },
    getCurFilRowCount: (state, getters, rootState) => {
        let curSheetName = rootState.excel.activeSheet.name
        return state.filRow[curSheetName] || 0
    },
    getCurColCount: (state, getters, rootState) => {
        let curSheetName = rootState.excel.activeSheet.name,
            curColKeys = state.colKeys[curSheetName]
        return curColKeys || curColKeys.length ||0
    },
    getCurColKeys: (state, getters, rootState) => {
        let curSheetName = rootState.excel.activeSheet.name,
        return state.colKeys[curSheetName]        
    }
}

const actions = {
    // 涉及多个模块，应该放在 action.js
    setExcelData({ state, commit, rootState }, excelObj) {
        commit(types.SET_UPLOAD_STATUS, 0)
        ipcRenderer.send('readFile-start', {
            data: excelObj
        })
        ipcRenderer.once('readFile-response', (event, excelObj) => {
            commit(types.SET_EXCEL_BASE_INFO, excelObj)
            commit(types.SET_UPLOAD_STATUS, -1)
            commit(types.SET_ACTIVE_SHEET, 0)
            commit(types.TOGGLE_FILTER_PANEL_STATUS, true)
            commit(types.INIT_UNIQUE, excelObj.sheetNameList)
        })
    },
    setActiveSheet({ state, commit, rootState }, index) {
        commit(types.SET_ACTIVE_SHEET, index)
    },
    setFilteredData({ state, commit, rootState }, filRow) {
        commit(types.SET_FILTERED_DATA, filRow)
    }
}

const mutations = {
    [types.TOGGLE_SIDEBAR] (state, isShowSideBar) {
        if(_.isBoolean(isShowSideBar))
            state.isShowSideBar = isShowSideBar
        else 
            state.isShowSideBar = !state.isShowSideBar
    },
    [types.SET_EXCEL_BASE_INFO] (state, excelBaseInfoObj) {
        Object.keys(excelBaseInfoObj).forEach((key, index) => {
            state[key] = excelBaseInfoObj[key]
        })
    },
    [types.SET_ACTIVE_SHEET] (state, index) {
        state.activeSheet = {
            index,
            name: state.sheetNameList[index]
        }
    },
    [types.SET_FILTER_DATA] (state, filRow) {
        state.filRow = filRow
    }
}
