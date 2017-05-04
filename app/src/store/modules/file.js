import pathModule from 'path'
import * as types from '../mutation-types'
import { getLocal, setLocal } from '../../utils/localStorageSet'
import _ from 'lodash'

let uploadFiles = (function initUploadFiles() {
    let localUploadFiles = getLocal('uploadFiles')
    if (_.isArray(localUploadFiles)) {
        return localUploadFiles
    } else {
        return []
    }
})();


const state = {
    fileList: uploadFiles,
    curSearchVal: '',
    isShowSideBar: false,
    fileStatus: -1 // 0: 正在导入中  1: 过滤中  2: 导出中
}

const getters = {
    // getters 包含所有模块的getters（扁平化后），rootState 与 actions 相同
    getUploadFiles: (state, getters, rootState) => state.fileList,
    getCurSearchVal: (state, getters, rootState) => state.curSearchVal,
    getFileStatus: (state, getters, rootState) => state.fileStatus,
    getSideBarStatus: (state, getters, rootState) => state.isShowSideBar
}

const actions = {
    changeSearchVal({ state, commit, rootState }, searchVal) {
        commit(types.CHANGE_SEARCH_VALUE, searchVal)
    },
    setUploadFiles({ state, commit, rootState }, fpath) {
        let fileObj = {
            path: fpath,
            name: pathModule.basename(fpath),
            extname: pathModule.extname(fpath)
        }
        commit(types.SET_UPLOAD_FILES, fileObj)
    },
    // 去掉复数
    delUploadFiles({ state, commit, rootState }, index) {
        commit(types.DEL_UPLOAD_FILES, index)
    },
    toggleSideBar({ state, commit, rootState }, isShowSideBar) {
        commit(types.TOGGLE_SIDEBAR, isShowSideBar)
    },
    setFileStatus({ state, commit, rootState }, fileStatus) {
        commit(types.SET_UPLOAD_STATUS, fileStatus)
    }
}

const mutations = {
    // 约定 payload 皆对象
    [types.TOGGLE_SIDEBAR](state, isShowSideBar) {
        if (_.isBoolean(isShowSideBar))
            state.isShowSideBar = isShowSideBar
        else
            state.isShowSideBar = !state.isShowSideBar
    },
    [types.CHANGE_SEARCH_VALUE](state, val) {
        state.curSearchVal = val
    },
    [types.SET_UPLOAD_FILES](state, fileObj) {
        let isExistent = false,
            existentIndex = 0

        state.fileList.some((file, index) => {
            if (file.path === fileObj.path) {
                isExistent = true
                existentIndex = index

                return true
            }
        })

        if (isExistent) {
            state.fileList.splice(existentIndex, 1)
            state.fileList.unshift(fileObj)
        } else {
            state.fileList.unshift(fileObj)
        }

        setLocal('uploadFiles', state.fileList)
    },
    // 去掉复数
    [types.DEL_UPLOAD_FILES](state, index) {
        state.fileList.splice(index, 1)
        setLocal('uploadFiles', state.fileList)
    },
    // 命名要改
    [types.SET_UPLOAD_STATUS](state, status) {
        state.fileStatus = status
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}