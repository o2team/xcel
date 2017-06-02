'use strict'

const xlsx = require('xlsx')
const electron = require('electron')
const ipcRenderer = electron.ipcRenderer
const SUFFIX_COLKEYS = '_headers'
function Excel () {
  this.workbook = null
  this.sheetNameList = null
}

Excel.prototype = {
  constructor: Excel,

  init ({ type, path }) {
    let isParseSuccess = true
    try {
      if (type) {
        if (type === 'node') {
          this.readByPath(path)
        }/* else if (type === 'data') {
          this.readByData(data)
        } */
      }
    } catch (e) {
      isParseSuccess = false
      ipcRenderer.send('sync-alert-dialog', {
        content: '不支持该文件格式'
      })
    }
    if (isParseSuccess) {
      try {
        this.initData()
      } catch (e) {
        console.log(e)
        ipcRenderer.send('sync-alert-dialog', {
          content: 'Excel内容的格式不符合要求，故导致文件解析失败'
        })
      }
      return this
    }
    return {}
  },
  readByData (data) {
        // 用于前端上传文件，如：上传按钮和拖拽上传
    this.workbook = xlsx.read(data, { type: 'binary' })
  },
  readByPath (filename) {
        // 用于 Node 直接通过路径读取文件
    this.workbook = xlsx.readFile(filename)
  },
  initData () {
        // 表名列表
    this.sheetNameList = this.workbook.SheetNames

        // 插入每个sheet的数据（json格式）
    this.sheetNameList.forEach((curSheetName, index) => {
      this[curSheetName] = xlsx.utils.sheet_to_json(this.workbook.Sheets[curSheetName])
    })

        // 获取表头
    this.sheetNameList.forEach((curSheetName, index) => {
      const curSheetData = this.workbook.Sheets[curSheetName]
      const scope = this.workbook.Sheets[curSheetName]['!ref'].split(':') // A1 F5
      const startIndex = getNumCol(extractLetters(scope[0])) // Excel 是从 1 开始
      const endIndex = getNumCol(extractLetters(scope[1]))

      this[`${curSheetName}_headers`] = []

      for (let i = startIndex, emptyIndex = 0; i <= endIndex; i++) {
        const curColKey = typeof curSheetData[`${getCharCol(i)}1`] === 'undefined' ? `表头空${emptyIndex++}` : curSheetData[`${getCharCol(i)}1`].v
        this[`${curSheetName}_headers`].push(curColKey)
      }
    })
  },
  exportFileByWB ({ filteredData, excelData, writeOpts }) {
    const finalWB = {
      SheetNames: [],
      Sheets: {}
    }
    let sheetNameList = this.sheetNameList

    sheetNameList.forEach((sheetName, i) => {
      let wbTem = this.jsonToWBForOneSheet(filteredData[sheetName], excelData[sheetName + SUFFIX_COLKEYS], sheetName)
      finalWB.SheetNames.push(wbTem.SheetNames[0])
      finalWB.Sheets[sheetName] = wbTem.Sheets[sheetName]
      wbTem = null
    })
    sheetNameList = null
        // console.log(finalWB)
    ipcRenderer.send('sync-saveFile-dialog', {
      filename: '过滤后的文件.xlsx',
      data: finalWB
    })
        // console.log(xlsx.writeFile(finalWB, fileName)) // Node导出
        // let wbout = XLSX.write(finalWB, {bookType:'xlsx', bookSST:false, type: 'binary'});
        // saveAs(new Blob([s2ab(wbout)],{type:'application/octet-stream'}), fileName)
  },

  jsonToWBForOneSheet (json, colkeys, sheetName) {
    const _headers = colkeys // 获取表头
    let data = {}

    let headers = _headers
      .map((v, i) => Object.assign({}, { v, position: getCharCol(i) + 1 }))
      .reduce((prev, next) => Object.assign({}, prev, {
        [next.position]: { v: next.v }
      }), {})

    const step1 = json.map((v, i) => _headers.map((k, j) => Object.assign({}, { v: v[k], position: getCharCol(j) + (i + 2) })))
    if (step1.length === 0) {
      for (let i = 0, len = step1.length; i < len; i++) {
        const v = step1[i]
        data[v.position] = { v: v.v }
      }
    } else {
      const step2 = step1.reduce((prev, next) => prev.concat(next))
      for (let i = 0, len = step2.length; i < len; i++) {
        const v = step2[i]
        data[v.position] = { v: v.v }
      }
    }

    const output = Object.assign({}, headers, data)
    const outputPos = Object.keys(output)
    const ref = `${outputPos[0]}:${outputPos[outputPos.length - 1]}`
    const wb = {
      SheetNames: [sheetName],
      Sheets: {
        [sheetName]: Object.assign({}, output, { '!ref': ref })
      }
    }

    headers = null
    data = null
    return wb
  }
}

// 提取字母
function extractLetters (str) {
  return str.replace(/[^a-zA-Z]+/g, '')
}

// 通过前端方式导出文件时用到
/* function s2ab (s) {
  const buf = new ArrayBuffer(s.length)
  const view = new Uint8Array(buf)
  for (let i = 0; i !== s.length; i++) {
    view[i] = s.charCodeAt(i) & 0xFF
  }
  return buf
} */
function getCharCol (n) {
  let s = ''
  let m = 0
  while (n >= 0) {
    m = (n % 26) + 1
    s = String.fromCharCode(m + 64) + s
    n = (n - m) / 26
  }
  return s
}
function getNumCol (s) {
  if (!s) return 0
  let n = 0
  for (let i = s.length - 1, j = 1; i >= 0; i--, j *= 26) {
    const c = s[i].toUpperCase()
    if (c < 'A' || c > 'Z') return 0
    n += (c.charCodeAt() - 64) * j
  }
  return n - 1
}

module.exports = Excel
