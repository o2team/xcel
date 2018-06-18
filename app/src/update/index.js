const electron = require('electron')
const ipcRenderer = electron.ipcRenderer
const $ = document.querySelector.bind(document)
const cur = $('#cur')
const total = $('#total')
const dprogressBar = $('.dprogress_bar')
const pauseBtn = $('.pause_btn')
const cancelBtn = $('.cancel_btn')

function willDownloadResponse (event, { curReceivedBytes, totalBytes, downloadStatus }) {
  const percentage = `${curReceivedBytes / totalBytes * 100}%`
  cur.innerText = (curReceivedBytes / 1024 / 1024).toFixed(2)
  total.innerText = (totalBytes / 1024 / 1024).toFixed(2)
  dprogressBar.style.width = percentage
}
function cancelBtnHandler () {
  ipcRenderer.send('update-cancel')
}
function pauseBtnHandler () {
  ipcRenderer.send('update-switch')
}
function togglePauseBtn (event, { text }) {
  pauseBtn.innerText = text
}

ipcRenderer.on('will-download-response', willDownloadResponse)
ipcRenderer.on('update-switch-response', togglePauseBtn)
cancelBtn.addEventListener('click', cancelBtnHandler, false)
pauseBtn.addEventListener('click', pauseBtnHandler, false)
