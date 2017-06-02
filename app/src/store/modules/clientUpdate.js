import * as types from '../mutation-types'
import { getLocal, setLocal } from '../../utils/localStorageSet'
import _ from 'lodash'

const isKeepCurVersion = (function initIsKeepVersion () {
  let isKeepCurVersionTemp = getLocal('isKeepCurVersion')
  if (!_.isBoolean(isKeepCurVersionTemp)) {
    isKeepCurVersionTemp = false
  }
  return isKeepCurVersionTemp
})()

const state = {
  url: '',
  version: '',
  log: '',
  pubDate: '',
  isShowUpdateDialog: false,
  isKeepCurVersion,
  isHasNewVersion: false
}

const getters = {
  getUpdateDialogStatus: state => state.isShowUpdateDialog,
  getUpdateUrl: state => state.url,
  getUpdateVersion: state => state.version,
  getUpdateLog: state => state.log,
  getUpdatePubDate: state => state.pubDate,
  getKeepCurVersion: state => state.isKeepCurVersion,
  getHasNewVersionStatus: state => state.isHasNewVersion
}

const actions = {
  toggleUpdateDialog ({ state, commit, rootState }, isShowUpdateDialog) {
    commit(types.TOGGLE_UPDATE_DIALOG, isShowUpdateDialog)
  },
  setUpdateUrl ({ state, commit, rootState }, url) {
    commit(types.SET_UPDATE_URL, url)
  },
  setUpdateVersion ({ state, commit, rootState }, version) {
    commit(types.SET_UPDATE_VERSION, version)
  },
  setUpdateLog ({ state, commit, rootState }, notes) {
    commit(types.SET_UPDATE_LOG, notes)
  },
  setUpdatePubDate ({ state, commit, rootState }, pubDate) {
    commit(types.SET_UPDATE_PUB_DATE, pubDate)
  },
  setKeepVersionStatus ({ state, commit, rootState }, isKeepCurVersion) {
    commit(types.SET_KEEP_VERSION_STATUS, isKeepCurVersion)
  },
  setHasNewStatus ({ state, commit, rootState }, isHasNewVersion) {
    commit(types.SET_HAS_NEW_VERSION, isHasNewVersion)
  }
}

const mutations = {
  [types.TOGGLE_UPDATE_DIALOG] (state, isShowUpdateDialog) {
    if (_.isBoolean(isShowUpdateDialog)) {
      state.isShowUpdateDialog = isShowUpdateDialog
    } else {
      state.isShowUpdateDialog = !state.isShowUpdateDialog
    }
  },
  [types.SET_UPDATE_URL] (state, url) {
    state.url = url
  },
  [types.SET_UPDATE_VERSION] (state, version) {
    state.version = version
  },
  [types.SET_UPDATE_LOG] (state, log) {
    state.log = log
  },
  [types.SET_UPDATE_PUB_DATE] (state, pubDate) {
    state.pubDate = pubDate
  },
  [types.SET_KEEP_VERSION_STATUS] (state, isKeepCurVersion) {
    state.isKeepCurVersion = isKeepCurVersion
    setLocal('isKeepCurVersion', state.isKeepCurVersion)
  },
  [types.SET_HAS_NEW_VERSION] (state, isHasNewVersion) {
    state.isHasNewVersion = isHasNewVersion
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
