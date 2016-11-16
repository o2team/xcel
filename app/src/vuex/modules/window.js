import * as types from '../mutation-types'
import { ipcRenderer } from 'electron'



const state = {
	isMaximize: false,
	isMinimize: false
}

const mutations = {
	[types.TOGGLE_WINDOW_MAX] (state) {
    ipcRenderer.send('sync-maximize')
		state.isMaximize = !state.isMaximize
	},
	[types.TOGGLE_WINDOW_MINI] (state) {
    ipcRenderer.send('sync-minimize')
		state.isMinimize = !state.isMinimize
	}
}

ipcRenderer.on('send-isMax', (event, arg) => {
	state.isMaximize = arg
})

export default {
	state,
	mutations
}