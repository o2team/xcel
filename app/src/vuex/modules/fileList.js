import * as types from '../mutation-types'
import { ipcRenderer } from 'electron'

let uploadFiles = JSON.parse(window.localStorage.uploadFiles).length > 0 ? JSON.parse(window.localStorage.uploadFiles) : []
const state = {
  fileList: uploadFiles, // 最近的excel文件列表（sidebar）
  allFileType: ['all', 'xls', 'xlsx'], 
  curSearchVal: '', // 搜索值
  isShowSideBar: false,
  fileStatus: -1 // 0：正在导入中 1：过滤中 2：导出中
}

const mutations = {
  [types.TOGGLE_SIDEBAR] (state, val) {
    if(isBoolean(val) ){
      state.isShowSideBar = val
    }else{
  	  state.isShowSideBar = !state.isShowSideBar
    }
	},
  [types.CHANGE_SEARCH_VALUE] (state, val) {
    state.curSearchVal = val
  },
  [types.SET_UPLOAD_FILES] (state, val) {
    let isExistent = false,
        existentIndex = 0
    state.fileList.forEach((file, index) => {
      if(file.path === val.path){
        isExistent = true
        existentIndex = index
        return true
      }
    })
    if(isExistent) {
      state.fileList.splice(existentIndex, 1)
      state.fileList.unshift(val)
    }else{
      state.fileList.unshift(val)
    }
    window.localStorage.setItem('uploadFiles', JSON.stringify(state.fileList))
  },
  [types.DEL_UPLOAD_FILES] (state, index) {
    state.fileList.splice(index, 1)
    window.localStorage.setItem('uploadFiles', JSON.stringify(state.fileList))
  },
  [types.SET_UPLOAD_STATUS] (state, val) {
    state.fileStatus = val
  }
}

export default {
  state,
  mutations
}

function isBoolean(val) {
  return val === true || val === false
}