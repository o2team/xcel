import * as types from '../mutation-types'
import { getLocal, setLocal } from '../../utils/localStorageSet'
import _ from 'loadash'

let isKeepCurVersion = (function initIsKeepVersion() {
    let isKeepCurVersionTemp = getLocal('isKeepCurVersion')
    if (!_.isBoolean(isKeepCurVersionTemp)) {
        isKeepCurVersionTemp = false
    }
    return isKeepCurVersionTemp
})();

const state = {
    url: '',
    version: '',
    notes: '',
    pubDate: '',
    isShowUpdateDialog: false,
    isKeepCurVersion: isKeepCurVersion,
    isHasNew: false
}

const getters = {
    getUpdateDialogStatus: state => state.isShowUpdateDialog,
    getUpdateUrl: state => state.url,
    getUpdateVersion: state => state.version,
    getUpdateNotes: state => state.notes,
    getUpdatePubDate: state => state.pubDate,
    getKeepCurVersion: state => state.isKeepCurVersion,
    getHasNewStatus: state => state.isHasNew
}

const actions = {
    toggleUpdateDialog({ state, commit, rootState }, isShowUpdateDialog) {
        commit(types.TOGGLE_UPDATE_DIALOG, isShowUpdateDialog)
    },
    setUpdateUrl({ state, commit, rootState }, url) {
        commit(types.SET_UPDATE_URL, url)
    },
    setUpdateVersion({ state, commit, rootState }, version) {
        commit(types.SET_UPDATE_VERSION, version)
    },
    setUpdateNotes({ state, commit, rootState }, notes) {
        commit(types.SET_UPDATE_NOTES, notes)
    },
    setUpdatePubDate({ state, commit, rootState }, pubDate) {
        commit(types.SET_UPDATE_PUB_DATE, pubDate)
    },
    setKeepVersionStatus({ state, commit, rootState }, isKeepCurVersion) {
        commit(types.SET_KEEP_VERSION_STATUS, isKeepCurVersion)
    },
    setHasNewStatus({ state, commit, rootState }, isHasNew) {
        commit(types.SET_HAS_NEW_STATUS, isHasNew)
    }
}

const mutations = {
    [types.TOGGLE_UPDATE_DIALOG](state, isShowUpdateDialog) {
        if (_.isBoolean(isShowUpdateDialog))
            state.isShowUpdateDialog = isShowUpdateDialog
        else
            state.isShowUpdateDialog = !state.isShowUpdateDialog
    },
    [types.SET_UPDATE_URL](state, url) {
        state.url = url
    },
    [types.SET_UPDATE_VERSION](state, version) {
        state.version = version
    },
    [types.SET_UPDATE_NOTES](state, notes) {
        state.notes = notes
    },
    [types.SET_UPDATE_PUB_DATE](state, pubDate) {
        state.pubDate = pubDate
    },
    [types.SET_KEEP_VERSION_STATUS](state, isKeepCurVersion) {
        state.isKeepCurVersion = isKeepCurVersion
        setLocal('isKeepCurVersion', state.isKeepCurVersion)
    },
    [types.SET_HAS_NEW_STATUS](state, isHasNew) {
        state.isHasNew = isHasNew
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}