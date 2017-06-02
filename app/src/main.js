import Vue from 'vue'
import Electron from 'vue-electron'
import Router from 'vue-router'

import 'font-awesome/css/font-awesome.min.css'
import App from './App'
import routes from './routes'
import store from './store'

Vue.use(Electron)
Vue.use(Router)

window.eventBus = new Vue()

const router = new Router(routes)

/* eslint-disable */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
/* eslint-enable */
