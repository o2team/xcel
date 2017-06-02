export default {
  routes: [{
    path: '/',
    name: 'index',
    component: require('./components/FirstScreenPageView')
  },
  {
    path: '/instructions',
    name: 'instructions',
    component: require('./components/InstructionsPageView')
  }, {
    path: '*',
    redirect: '/'
  }]
}
