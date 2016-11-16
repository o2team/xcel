import Vue from 'vue'
import Electron from 'vue-electron'
import Resource from 'vue-resource'
import Router from 'vue-router'

import 'font-awesome/css/font-awesome.min.css'
import App from './App'
import routes from './routes'
import store from './vuex/store'

Vue.use(Electron)
Vue.use(Resource)
Vue.use(Router)

window.eventBus = new Vue()

const router = new Router(routes)

new Vue({
	el: '#app',
	router: router,
	store,
	render: h => h(App)
})