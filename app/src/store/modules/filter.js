import * as types from '../mutation-types'
import * as Excel from '../../utils/ExcelSet'
import { getLocal, setLocal } from '../../utils/localStorageSet'
import _ from 'lodash'
import { ipcRenderer } from 'electron'

let filterWay = getLocal('filterWay')
    if(!filterWay) filterWay = 0

const state = {
    filterTagList: {},
    filterWay, // 0 保留、1 剔除
    isShowFilterPanel: false,
    isShowColSelectDialog: false,
    colSelecType: -1, // 0 单列、1 多列、2 双列范围、3 去重
    filterOptions: [
        {char: '>', words: '大于'},
        {char: '<', words: '小于'},
        {char: '>=', words: '大于或等于'},
        {char: '<=', words: '小于或等于'},
        {char: '=', words: '等于'},
        {char: '!=', words: '不等于'},
        {char: 'contain', words: '包含'},
        {char: 'notContain', words: '不包含'},
        {char: 'startWith', words: '开头字符'},
        {char: 'endWith', words: '结束字符'},
        {char: 'regexp', words: '正则表达式'},
        {char: 'empty', words: '为空'},
        {char: 'notEmpty', words: '不为空'}
    ]
}

const getters = {
    // 暂为空
    getFilterOptions: (state, getters, rootState) => state.filterOptions,
    getFilterTagList: (state, getters, rootState) => state.filterTagList,
    getFilterWay: (state, getters, rootState) => state.filterWay,
    getFilterPanelStatus: (state, getters, rootState) => state.isShowFilterPanel,
    getCurFilterTagListCount: (state, getters, rootState) => {
        let curSheetName = rootState.excel.activeSheet.name,
            curFilterTagList = state.filterTagList[curSheetName]
        return curFilterTagList && curFilterTagList.length || 0
    },
    getColSelectDialogStatus: (state, getters, rootState) => {
        return state.isShowColSelectDialog
    },
    getColSelectType: (state, getters, rootState) => state.colSelecType
}

const actions = {
    // 对于内部 action，context.state 是局部状态，根节点的状态是context.rootState
    // 还能有 getters，这样就可以简化 activeSheetName
    addFilter({ state, commit, rootState, getters }, filter) {
        commit(types.ADD_FILTER, {
            curSheetName: rootState.excel.activeSheet.name,
            filter
        })
    },
    delFilter({ state, commit, rootState }, index) {
        let curSheetName = rootState.excel.activeSheet.name
        commit(types.DEL_FILTER, {
            curSheetName,
            index,
            curUniqueCols: rootState.unique.cols[curSheetName]
        })
    },
    setFilterWay({ state, commit, rootState }, filterWay) {
        commit(types.SET_FILTER_WAY, filterWay)
    },
    toggleFilterPanelStatus({ state, commit, rootState }, isShowFilterPanel) {
        commit(types.TOGGLE_FILTER_PANEL_STATUS, isShowFilterPanel)
    },
    setColSelectDialogStatus({ state, commit, rootState }, isShowColSelectDialog) {
        commit(types.SET_COL_SELECT_DIALOG_STATUS, isShowColSelectDialog)
        if(isShowColSelectDialog === true) {
            commit(types.TOGGLE_SIDEBAR, false)
        }
    },
    setColSelectType({ state, commit, rootState }, colSelecType) {
        commit(types.SET_COL_SELECT_TYPE, colSelecType)
    }
}

const mutations = {
    [types.TOGGLE_WINDOW_MAX](state) {
        ipcRender.send('sync-maximize')
        state.isMaximize = !state.isMaximize
    },
    [types.ADD_FILTER] (state, {curSheetName, filter}) {
        if(curSheetName) {
            let tempTagList = Object.assign({}, state, filterTagList),
                curTagList = tempTagList[curSheetName],
                isHasSameGroup = false
            
            // 判断当前filter是否存在组
            // 若存在，则判断是否存在同类组
            if(filter.groupId != '-1') {
                curTagList.some((item, index) => {
                    if(filter.groupId === item.groupId) {
                        item.filters.push(filter)
                        isHasSameGroup = true
                        return true
                    }
                })
            }

            // 若不存在 或 找不到同类组
            if(!isHasSameGroup) {
                let filterObj = {
                    groupId: filter.groupId,
                    logicOperator: filter.logicOperator,
                    filters: [filter]
                }
                curTagList.push(filterObj)
            }

            state.filterTagList = tempTagList
            tempTagList = null
        } else {
            ipcRenderer.send('sync-alert-dialog', {
                content: '还没上传相应的Excel文件'
            })
        }
    },
    [types.DEL_FILTER] (state, {curSheetName, index, curUniqueCols}) {
        let tempTagList = Object.assign({}, state.filterTagList)
        
        tempTagList[curSheetName].splice(index, 1)
        state.filterTagList = tempTagList
        
        let filterTagListlen = state.filterTagList[curSheetName].length

        if(filterTagListlen === 0 && curUniqueCols.length === 0) {
            ipcRenderer.send('delAllFilterTag-start', {
                curActiveSheetName: curSheetName
            })
            state.filRow[curSheetName] = state.oriRow[curSheetName]
        } 
    },
    [types.SET_FILTERED_DATA] (state, filRow) {
        state.filRow = filRow
    },
    [types.SET_FILTER_WAY] (state, filterWay) {
        state.filterWay = filterWay
        setLocal('filterWay', filterWay)
    },
    [types.TOGGLE_FILTER_PANEL_STATUS] (state, isShowFilterPanel) {
        if(_.isBoolean(isShowFilterPanel)) {
            state.isShowFilterPanel = isShowFilterPanel
        } else {
            state.isShowFilterPanel = !isShowFilterPanel
        }
    },
    [types.SET_COL_SELECT_DIALOG_STATUS] (state, isShowColSelectDialog) {
        state.isShowColSelectDialog = isShowColSelectDialog
    },
    [types.SET_COL_SELECT_TYPE] (state, colSelecType) {
        state.colSelecType = colSelecType
    }
}


export default {
    state,
    getters,
    actions,
    mutations
}