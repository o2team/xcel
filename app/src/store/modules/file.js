import pathModule from 'path'
import * as types from '../mutation-types'
import { getLocal, setLocal } from '../../utils/localStorageSet'
import _ from 'lodash'

const uploadFiles = (function initUploadFiles () {
  const localUploadFiles = getLocal('uploadFiles')
  if (_.isArray(localUploadFiles)) {
    return localUploadFiles
  }
  return []
})()

const state = {
  fileList: uploadFiles,
  searchVal: '',
  isShowSideBar: false,
  fileStatus: -1 // 0: 正在导入中  1: 过滤中  2: 导出中
}

const getters = {
    // getters 包含所有模块的getters（扁平化后），rootState 与 actions 相同
  getUploadFiles: (state, getters, rootState) => state.fileList,
  getSearchVal: (state, getters, rootState) => state.searchVal,
  getFileStatus: (state, getters, rootState) => state.fileStatus,
  getSideBarStatus: (state, getters, rootState) => state.isShowSideBar
}

const actions = {
  setSearchVal ({ state, commit, rootState }, searchVal) {
    commit(types.CHANGE_SEARCH_VALUE, searchVal)
  },
  setUploadFiles ({ state, commit, rootState }, fpath) {
    const fileObj = {
      path: fpath,
      name: pathModule.basename(fpath),
      extname: pathModule.extname(fpath)
    }
    commit(types.SET_UPLOAD_FILES, fileObj)
  },
  delUploadFile ({ state, commit, rootState }, fileObj) {
    commit(types.DEL_UPLOAD_FILES, fileObj)
  },
  toggleSideBar ({ state, commit, rootState }, isShowSideBar) {
    commit(types.TOGGLE_SIDEBAR, isShowSideBar)
  },
  setFileStatus ({ state, commit, rootState }, fileStatus) {
    commit(types.SET_FILE_STATUS, fileStatus)
  }
}

const mutations = {
  [types.TOGGLE_SIDEBAR] (state, isShowSideBar) {
    if (_.isBoolean(isShowSideBar)) {
      state.isShowSideBar = isShowSideBar
    } else {
      state.isShowSideBar = !state.isShowSideBar
    }
  },
  [types.CHANGE_SEARCH_VALUE] (state, searchVal) {
    state.searchVal = searchVal
  },
  [types.SET_UPLOAD_FILES] (state, fileObj) {
    let isExistent = false
    let existentIndex = 0

    for (let i = 0, len = state.fileList.length; i < len; i++) {
      const file = state.fileList[i]
      if (file.path === fileObj.path) {
        isExistent = true
        existentIndex = i

        break
      }
    }

    if (isExistent) {
      state.fileList.splice(existentIndex, 1)
      state.fileList.unshift(fileObj)
    } else {
      state.fileList.unshift(fileObj)
    }

    setLocal('uploadFiles', state.fileList)
  },
    // 去掉复数
  [types.DEL_UPLOAD_FILES] (state, fileObj) {
    for (let i = 0, len = state.fileList.length; i < len; i++) {
      const file = state.fileList[i]
      if (file.name === fileObj.name && file.path === fileObj.path) {
        state.fileList.splice(i, 1)
        break
      }
    }
    setLocal('uploadFiles', state.fileList)
  },
    // 命名要改
  [types.SET_FILE_STATUS] (state, status) {
    state.fileStatus = status
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
