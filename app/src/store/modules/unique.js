import * as types from '../mutation-types'

const state = {
    cols: {} // ...sheetNameList
}

const getters = {
    // getters 包含所有模块的getters（扁平化后），rootState 与 actions 相同
    getUniqueCols: (state, getters, rootState) => state.cols[rootState.activeSheet.name]
}

const actions = {
    setUniqueCols({ state, commit, rootState }, cols) {
        commit(types.SET_UNIQUE_COLS, {
            curSheetName: rootState.excel.activeSheet.name,
            cols
        })
    }
}

const mutations = {
    // 约定 payload 皆对象
    [types.SET_UNIQUE_COLS](state, { curSheetName, cols }) {
        state.cols[curSheetName] = cols
    },
    [types.INIT_UNIQUE] (state, sheetNameList) {
        sheetNameList.forEach((sheetName) => {
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