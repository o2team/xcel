import { ipcRenderer } from 'electron'
import * as types from './mutation-types'

// action 和 getter 的 context 参数共6个对象
// state(rootState）会分模块、getters(rootGetters)不分模块（扁平化）
export const checkFilterAndUnqiueCount = ({commit, dispatch, getters, rootGetters, rootState, state}) => {
    let curSheetName = getters.getActiveSheet.name,
        curFilterTagList = getters.getFilterTagList[curSheetName],
        curUniqueCols = getters.getUniqueCols[curSheetName]
    
    if(curFilterTagList.length === 0 && curUniqueCols.length === 0) {
        ipcRenderer.send('delAllFilterTag-start', {
            curActiveSheetName: curSheetName
        })
        commit(types.SET_FILTERED_DATA, null)        
    }
}