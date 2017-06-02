import * as types from '../mutation-types'

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
  getActiveSheetName: (state, getters, rootState) => state.activeSheet.name,
  getCurOriRowCount: (state, getters, rootState) => {
    const activeSheetName = getters.getActiveSheetName
    return state.oriRow[activeSheetName] || 0
  },
  getCurFilRowCount: (state, getters, rootState) => {
    const activeSheetName = getters.getActiveSheetName
    return state.filRow[activeSheetName] || 0
  },
  getCurColCount: (state, getters, rootState) => {
    const activeSheetName = getters.getActiveSheetName
    const curColKeys = state.colKeys[activeSheetName]
    return (curColKeys && curColKeys.length) || 0
  },
  getCurColKeys: (state, getters, rootState) => {
    const activeSheetName = getters.getActiveSheetName
    return state.colKeys[activeSheetName]
  }
}

const actions = {
  setActiveSheet ({ state, commit, rootState }, index) {
    commit(types.SET_ACTIVE_SHEET, index)
  },
    // 筛选后的数据，目前只有 行数
  setFilteredData ({ state, commit, rootState }, filRow) {
    commit(types.SET_FILTERED_DATA, filRow)
  }
}

const mutations = {
  [types.SET_EXCEL_BASE_INFO] (state, excelBaseInfoObj) {
    Object.keys(excelBaseInfoObj).forEach((key, index) => {
      if (key !== 'filterTagList') { state[key] = excelBaseInfoObj[key] }
    })
  },
  [types.SET_ACTIVE_SHEET] (state, index) {
    state.activeSheet = {
      index,
      name: state.sheetNameList[index]
    }
  },
  [types.SET_FILTERED_DATA] (state, filRow) {
    if (typeof filRow === 'undefined' || filRow === null) {
      state.filRow = state.oriRow
    } else {
      state.filRow = filRow
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
