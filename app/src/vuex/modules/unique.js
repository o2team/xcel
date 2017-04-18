import * as types from '../mutation-types'
import _ from 'lodash'
import { ipcRenderer } from 'electron'

const SUFFIX_COLKEYS = '_headers'

const state = {
    cols: {}
}


const mutations = {
    [types.SET_UNIQUE_COLS] (state, args) {
        console.log(state)
        let curSheetName = args.activeSheetName,
            cols = state.cols,
            curFilterTagList = args.curFilterTagList
        if(curSheetName) {
            let tempCols = Object.assign({}, state.filterTagList)
            tempCols[curSheetName] = args.cols
            state.cols = tempCols
            
            // todo：删除filterTag 和 uniqueCols 后，复原所有元素
        }
    },
    [types.INIT_UNIQUE] (state, sheetNameList) {
        sheetNameList.forEach((item) => {
            state.cols[item] = []
        })
    }
}

export default {
    state,
    mutations
}


