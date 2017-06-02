'use strict'

const path = require('path')
const pkg = require('./app/package.json')
const config = {
  // Name of electron app
  // Will be used in production builds
  name: pkg.product,

  // webpack-dev-server port
  port: 9080,

  // electron-packager options
  // Docs: https://github.com/electron-userland/electron-packager/blob/master/docs/api.md
  building: {
    appVersion: pkg.version,
    arch: ['x64', 'ia32'], // ia32, x64, armv7l, all
    asar: true,
    dir: path.join(__dirname, 'app'), // Directory of the app
    icon: path.join(__dirname, 'app/icons/icon'),
    ignore: /src|main.ejs|icons/,
    out: path.join(__dirname, 'builds'),
    overwrite: true,
    platform: process.env.PLATFORM_TARGET || 'all',
    name: pkg.product
  },

  isDev: process.env.NODE_ENV === 'development',
  backUrl: `file://${__dirname}/app/dist/background/index.html`
}

config.mainUrl = `http://localhost:${config.port}`

if (!config.isDev) {
  config.devtron = false
  config.mainUrl = `file://${__dirname}/app/dist/index.html`
}

module.exports = config
