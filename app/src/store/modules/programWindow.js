import * as types from '../mutation-types'
import { ipcRenderer } from 'electron'

const state = {
  isMaximize: false,
  isMinimize: false
}

const getters = {
    // 暂为空
}

const actions = {
    // 对于内部 action，context.state 是局部状态，根节点的状态是context.rootState
  toggleWindowMax ({ state, commit, rootState }) {
    commit(types.TOGGLE_WINDOW_MAX)
  },
  toggleWindowMin ({ state, commit, rootState }) {
    commit(types.TOGGLE_WINDOW_MIN)
  }
}

const mutations = {
  [types.TOGGLE_WINDOW_MAX] (state) {
    ipcRenderer.send('sync-maximize')
    state.isMaximize = !state.isMaximize
  },
  [types.TOGGLE_WINDOW_MIN] (state) {
    ipcRenderer.send('sync-minimize')
    state.isMinimize = !state.isMinimize
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
