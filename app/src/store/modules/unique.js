import * as types from '../mutation-types'
import Vue from 'vue'
const state = {
  cols: {} // ...sheetNameList
}

const getters = {
    // getters 包含所有模块的getters（扁平化后），rootState 与 actions 相同
  getUniqueCols: (state, getters, rootState) => state.cols,
  getCurUniqueColsCount: (state, getters, rootState) => {
    const activeSheetName = getters.getActiveSheetName
    const curCols = state.cols[activeSheetName]
    return (curCols && curCols.length) || 0
  },
}

const actions = {
  setUniqueCols ({ state, commit, rootState, getters }, cols) {
    commit(types.SET_UNIQUE_COLS, {
      activeSheetName: getters.getActiveSheetName,
      cols
    })
  }
}

const mutations = {
  [types.SET_UNIQUE_COLS] (state, { activeSheetName, cols }) {
    state.cols[activeSheetName] = cols
  },
  [types.INIT_UNIQUE] (state, sheetNameList) {
    sheetNameList.forEach(sheetName => {
      Vue.set(state.cols, sheetName, [])
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
