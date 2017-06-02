const electron = require('electron')
const crashReporter = electron.crashReporter

exports.start = function () {
  crashReporter.start({
    productName: 'xcel',
    companyName: 'o2team',
    submitURL: 'http://localhost:4000/crash/',
    autoSubmit: true
  })
}
