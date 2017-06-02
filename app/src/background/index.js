'use strict'
const { ipcRenderer } = require('electron')
const filterUtils = require('./filterUtils')
const Excel = require('./excelUtils')
const generateHTMLString = require('./generateHTMLString')
const SUFFIX_COLKEYS = '_headers'
console.log('background进程pid：', process.pid)

let excelData
let filteredData
const colKeys = {}
let oriRow = {}
let filRow = {}

window.addEventListener('load', event => {
  ipcRenderer.on('readFile-start', (event, { data, activeSheetIndex }) => {
        /* excelData 的数据结构
        {
          sheetNameN: [] 所有行
          sheetNameN_headers: [] 所有列标题
          sheetNameList: []
          workbook: {} Excel 相关
        }
        */
    excelData = new Excel().init(data)
    oriRow = {}
    filRow = {}
    activeSheetIndex = activeSheetIndex || 0
    const filterTagList = {}
    const activeSheetName = excelData.sheetNameList[activeSheetIndex]
    const curColKeys = excelData[activeSheetName + SUFFIX_COLKEYS]
    const curSheetData = excelData[activeSheetName]

    excelData.sheetNameList.forEach(function (sheetName, index) {
      oriRow[sheetName] = excelData[sheetName].length
      filRow[sheetName] = excelData[sheetName].length
      colKeys[sheetName] = excelData[sheetName + SUFFIX_COLKEYS]
      filterTagList[sheetName] = []
    })

    ipcRenderer.send('generate-htmlstring-response', {
      sheetHTML: generateHTMLString({
        sheetData: curSheetData,
        colKeys: curColKeys
      })
    })

    ipcRenderer.send('readFile-response', {
      oriRow,
      filRow,
      colKeys,
      filterTagList,
      sheetNameList: excelData.sheetNameList
    })
  })
  ipcRenderer.on('filter-start', (event, { activeSheetName, filterTagList, filterWay, uniqueCols }) => {
    filteredData = filterHandler({ filterTagList, filterWay, uniqueCols })
    const curColKeys = colKeys[activeSheetName]
    const tempFilRow = {}

    excelData.sheetNameList.forEach((sheetName, index) => {
      tempFilRow[sheetName] = filteredData[sheetName].length
    })

    ipcRenderer.send('filter-response', {
      filRow: tempFilRow
    })

    ipcRenderer.send('generate-htmlstring-response', {
      sheetHTML: generateHTMLString({
        sheetData: filteredData[activeSheetName],
        colKeys: curColKeys
      })
    })
  })

  ipcRenderer.on('changeTab-start', (event, { activeSheetName, filterTagList, filterWay, uniqueCols }) => {
    filteredData = filterHandler({ filterTagList, filterWay, uniqueCols })
    const curColKeys = colKeys[activeSheetName]

    ipcRenderer.send('generate-htmlstring-response', {
      sheetHTML: generateHTMLString({
        sheetData: filteredData[activeSheetName],
        colKeys: curColKeys
      })
    })
  })

  ipcRenderer.on('exportFile-start', event => {
    excelData.exportFileByWB({
      filteredData,
      excelData
    })
    ipcRenderer.send('exportFile-response', { info: '成功导出' })
  })

  ipcRenderer.on('delAllFilterTag-start', (event, { activeSheetName }) => {
    const curColKeys = colKeys[activeSheetName]
    const curSheetData = excelData[activeSheetName]

    ipcRenderer.send('generate-htmlstring-response', {
      sheetHTML: generateHTMLString({
        sheetData: curSheetData,
        colKeys: curColKeys
      })
    })
  })
}, false)

function filterHandler ({ filterTagList, filterWay, uniqueCols }) {
  const tempFilteredData = Object.assign({}, excelData)
  for (let i = 0, len = excelData.sheetNameList.length; i < len; i++) {
    const curSheetName = excelData.sheetNameList[i]
    const curFilterTagList = filterTagList[curSheetName]
    const colKeys = excelData[curSheetName + SUFFIX_COLKEYS]
    const curUniqueCols = uniqueCols[curSheetName]

    if (curFilterTagList.length !== 0) {
      tempFilteredData[curSheetName] = tempFilteredData[curSheetName].filter((row, index) => {
        let rowExpStr = ''
        for (let i = 0, len = curFilterTagList.length; i < len; i++) {
          const cTag = curFilterTagList[i]
          const cFilters = cTag.filters
          const tagLogicChar = cTag.logicOperator === 'and' ? '&&' : '||'
          let groupExpStr = ''

                    // 遍历当前组的 filters
          cFilters.forEach((cF, index) => {
            const filterLogicChar = cF.logicOperator === 'and' ? '&&' : '||'
            const filterType = cF.filterType
            const filterCol = cF.col
            const operator = cF.operator
            const colOperator = cF.colOperator
            const target = cF.value
            const needConformColIndex = cF.needConformColIndex
            let oneFilterResult

            if (filterType === 0) {
              oneFilterResult = (filterUtils.filterByOneOperator({ row, colKeys, filterCol, operator, target }))
            } else if (filterType === 1) {
              oneFilterResult = (filterUtils.filterByMultiColCalc({ row, colKeys, filterCol, operator, target, colOperator }))
            } else if (filterType === 2) {
              oneFilterResult = (filterUtils.filterByDoubleColsRange({ row, colKeys, filterCol, operator, target, needConformColIndex }))
            }
            groupExpStr = groupExpStr + filterLogicChar + oneFilterResult

            if (filterLogicChar === '||' && oneFilterResult === true) {
              return true // as break
            }
          })
          groupExpStr = groupExpStr.replace(/^[|&]*/ig, '')
          /* eslint-disable no-eval */
          const oneTagResult = eval(groupExpStr)
          /* eslint-enable no-eval */

          rowExpStr = rowExpStr + tagLogicChar + oneTagResult
          if (tagLogicChar === '||' && oneTagResult === true) {
            break
          }
        }
        rowExpStr = rowExpStr.replace(/^[|&]*/ig, '')
        /* eslint-disable no-eval */
        const rowResult = eval(rowExpStr)
        /* eslint-enable no-eval */

        // return rowResult
        return (filterWay === 0 || filterWay === '0') ? rowResult : !rowResult
      })
    }

    if (curUniqueCols.length !== 0) {
      const curUniqueColKeys = curUniqueCols.map(item => colKeys[item])
      tempFilteredData[curSheetName] = uniqBy(tempFilteredData[curSheetName], curUniqueColKeys)
    }
  }
  return tempFilteredData
}

function uniqBy (arr, selectedColKeys) {
  const seen = {}
  return arr.filter(item => {
    const k = key(item, selectedColKeys)
    return seen.hasOwnProperty(k) ? false : (seen[k] = true)
  })
}

function key (item, selectedColKeys) {
  const filterItem = {}
  for (let i = 0, len = selectedColKeys.length; i < len; i++) {
    const key = selectedColKeys[i]
    filterItem[key] = item[key]
  }
  return JSON.stringify(filterItem)
}
