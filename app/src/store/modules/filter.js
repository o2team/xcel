import * as types from '../mutation-types'
import * as Excel from '../../utils/ExcelSet'
import { getLocal, setLocal } from '../../utils/localStorageSet'
import _ from 'lodash'
import { ipcRenderer } from 'electron'

let filterWay = getLocal('filterWay')
if (!filterWay) filterWay = 0

const state = {
    filterTagList: {},
    filterWay, // 0 保留、1 剔除
    isShowFilterPanel: false,
    isShowColSelectDialog: false,
    colSelecType: -1, // 0 单列、1 多列、2 双列范围、3 去重
    filterOptions: [
        { char: '>', words: '大于' },
        { char: '<', words: '小于' },
        { char: '>=', words: '大于或等于' },
        { char: '<=', words: '小于或等于' },
        { char: '=', words: '等于' },
        { char: '!=', words: '不等于' },
        { char: 'contain', words: '包含' },
        { char: 'notContain', words: '不包含' },
        { char: 'startWith', words: '开头字符' },
        { char: 'endWith', words: '结束字符' },
        { char: 'regexp', words: '正则表达式' },
        { char: 'empty', words: '为空' },
        { char: 'notEmpty', words: '不为空' }
    ]
}

const getters = {
    getFilterOptions: (state, getters, rootState) => state.filterOptions,
    getFilterTagList: (state, getters, rootState) => state.filterTagList,
    getFilterWay: (state, getters, rootState) => state.filterWay,
    getFilterPanelStatus: (state, getters, rootState) => state.isShowFilterPanel,
    getCurFilterTagListCount: (state, getters, rootState) => {
        let activeSheetName = getters.getActiveSheetName,
            curFilterTagList = state.filterTagList[activeSheetName]
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
        console.log('getters', getters)
        commit(types.ADD_FILTER, {
            activeSheetName: getters.getActiveSheetName,
            filter
        })
    },
    delFilter({ state, commit, rootState, getters }, index) {
        let activeSheetName = getters.getActiveSheetName
        commit(types.DEL_FILTER, {
            activeSheetName,
            index,
            curUniqueCols: rootState.unique.cols[activeSheetName]
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
        if (isShowColSelectDialog === true) {
            commit(types.TOGGLE_SIDEBAR, false)
        }
    },
    setColSelectType({ state, commit, rootState }, colSelecType) {
        commit(types.SET_COL_SELECT_TYPE, colSelecType)
    }
}

const mutations = {
    [types.ADD_FILTER](state, { activeSheetName, filter }) {
        if (activeSheetName) {
            console.log('state.filterTagList', state.filterTagList)
            console.log('curTagList', curTagList)
            console.log('activeSheetName', activeSheetName)
            let tempTagList = Object.assign({}, state.filterTagList),
                curTagList = tempTagList[activeSheetName],
                isHasSameGroup = false

            // 判断当前filter是否存在组
            // 若存在，则判断是否存在同类组
            if (filter.groupId != '-1') {
                curTagList.some((item, index) => {
                    if (filter.groupId === item.groupId) {
                        console.log(item.filters)
                        item.filters.push('filter', filter)
                        isHasSameGroup = true
                        return true
                    }
                })
            }

            // 若不存在 或 找不到同类组
            if (!isHasSameGroup) {
                let filterObj = {
                    groupId: filter.groupId,
                    logicOperator: filter.logicOperator,
                    filters: [filter]
                }
                console.log('curTagList', curTagList)
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
    [types.DEL_FILTER](state, { activeSheetName, index, curUniqueCols }) {
        let tempTagList = Object.assign({}, state.filterTagList)

        tempTagList[activeSheetName].splice(index, 1)
        state.filterTagList = tempTagList
    },
    [types.SET_FILTER_WAY](state, filterWay) {
        state.filterWay = filterWay
        setLocal('filterWay', filterWay)
    },
    [types.TOGGLE_FILTER_PANEL_STATUS](state, isShowFilterPanel) {
        if (_.isBoolean(isShowFilterPanel)) {
            state.isShowFilterPanel = isShowFilterPanel
        } else {
            state.isShowFilterPanel = !state.isShowFilterPanel
        }
    },
    [types.SET_COL_SELECT_DIALOG_STATUS](state, isShowColSelectDialog) {
        state.isShowColSelectDialog = isShowColSelectDialog
    },
    [types.SET_COL_SELECT_TYPE](state, colSelecType) {
        state.colSelecType = colSelecType
    },
    [types.INIT_FILTER_TAG_LIST](state, filterTagList) {
        state.filterTagList = filterTagList
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}