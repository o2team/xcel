import * as types from '../mutation-types'
import { getLocal, setLocal } from '../../utils/localStorageSet'
import _ from 'lodash'

let isKeepCurVersion = (function initIsKeepVersion() {
	let isKeepCurVersionTemp = getLocal('isKeepCurVersion')
	if(!_.isBoolean(isKeepCurVersionTemp)) {
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

const mutations = {
	[types.TOGGLE_UPDATE_DIALOG] (state, val) {
		if(_.isBoolean(val)) {
			state.isShowUpdateDialog = val
		} else {
			state.isShowUpdateDialog = !state.isShowUpdateDialog
		}
	},
	[types.SET_UPDATE_URL] (state, val) {
		state.url = val
	},
	[types.SET_UPDATE_VERSION] (state, val) {
		state.version = val
	},
	[types.SET_UPDATE_NOTES] (state, val) {
		state.notes = val
	},
	[types.SET_UPDATE_PUB_DATE] (state, val) {
		state.pubDate = val
	},
	[types.SET_KEEP_VERSION_STATUS] (state, val) {
		state.isKeepCurVersion = val
		setLocal('isKeepCurVersion', state.isKeepCurVersion)
	},
	[types.SET_HAS_NEW_STATUS] (state, val) {
		state.isHasNew = val
	}
}


export default {
	state,
	mutations
}