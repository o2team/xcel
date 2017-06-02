import { ipcRenderer } from 'electron'
import * as types from './mutation-types'

// action 和 getter 的 context 参数共6个对象
// state(rootState）会分模块、getters(rootGetters)不分模块（扁平化）
export const checkFilterAndUnqiueCount = ({ commit, dispatch, getters, rootGetters, rootState, state }) => {
  const activeSheetName = getters.getActiveSheet.name
  const curFilterTagList = getters.getFilterTagList[activeSheetName]
  const curUniqueCols = getters.getUniqueCols[activeSheetName]

  if (curFilterTagList.length === 0 && curUniqueCols.length === 0) {
    ipcRenderer.send('delAllFilterTag-start', {
      activeSheetName
    })
    commit(types.SET_FILTERED_DATA, null)
  }
}

export const initAfterImportFile = ({ state, commit, rootState }, excelObj) => {
  commit(types.SET_FILE_STATUS, 0)
  ipcRenderer.send('readFile-start', {
    data: excelObj
  })
  ipcRenderer.once('readFile-response', (event, excelObj) => {
    // excel
    commit(types.SET_EXCEL_BASE_INFO, excelObj)
    commit(types.SET_ACTIVE_SHEET, 0)

    // unique
    commit(types.INIT_UNIQUE, excelObj.sheetNameList)

    // file
    commit(types.SET_FILE_STATUS, -1)

    // filter
    commit(types.TOGGLE_FILTER_PANEL_STATUS, true)
    commit(types.INIT_FILTER_TAG_LIST, excelObj.filterTagList)
  })
}
