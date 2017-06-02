import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import clientUpdate from './modules/clientUpdate'
import excel from './modules/excel'
import file from './modules/file'
import filter from './modules/filter'
import unique from './modules/unique'
import programWindow from './modules/programWindow'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const isDev = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getters,
  modules: {
    clientUpdate,
    excel,
    file,
    filter,
    unique,
    programWindow
  },
  strict: isDev,
  plugins: isDev ? [createLogger()] : []
})
