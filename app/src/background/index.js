'use strict';
const { ipcRenderer } = require('electron')
const xlsx = require('xlsx')
const filterUtils = require('./filterUtils')
const Excel = require('./excelUtils')
const generateHTMLString = require('./generateHTMLString')
const SUFFIX_COLKEYS = '_headers'
console.log('background进程pid：', process.pid)

let excelData,
    filteredData,
    colKeys = {},
    oriRow = {},
    filRow = {}

window.addEventListener('load', (event) => {
    ipcRenderer.on('readFile-start', (event, arg) => {
        /* excelData 的数据结构
        {
          sheetNameN: [] 所有行
          sheetNameN_headers: [] 所有列标题
          sheetNameList: []
          workbook: {} Excel 相关
        }
        */
        excelData = new Excel().init(arg.data)
        oriRow = {}
        filRow = {}
        let filterTagList = {},
            activeSheetIndex = arg.activeSheetIndex || 0,
            activeSheetName = excelData.sheetNameList[activeSheetIndex],
            curColKeys = excelData[activeSheetName + SUFFIX_COLKEYS],
            curSheetData = excelData[activeSheetName];

        excelData.sheetNameList.forEach(function (sheetName, index) {
            oriRow[sheetName] = excelData[sheetName].length
            filRow[sheetName] = excelData[sheetName].length
            colKeys[sheetName] = excelData[sheetName + SUFFIX_COLKEYS]
            filterTagList[sheetName] = []
        })

        console.log('colKeys', colKeys)
        // console.info('curSheetData', curSheetData);
        for (var i = 0; i < curSheetData.length; i++) {
            console.log(curSheetData[i])
        }

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
    ipcRenderer.on('filter-start', (event, arg) => {
        filteredData = filterHandler(arg)
        let activeSheetName = arg.activeSheetName,
            curColKeys = colKeys[activeSheetName],
            tempFilRow = {}

        excelData.sheetNameList.forEach((sheetName, index) => {
            tempFilRow[sheetName] = filteredData[sheetName].length
        })
        console.log('tempFilRow', tempFilRow)
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

    ipcRenderer.on('changeTab-start', (event, arg) => {
        filteredData = filterHandler(arg)
        let activeSheetName = arg.activeSheetName,
            curColKeys = colKeys[activeSheetName],
            tempFilRow = {}

        ipcRenderer.send('generate-htmlstring-response', {
            sheetHTML: generateHTMLString({
                sheetData: filteredData[activeSheetName],
                colKeys: curColKeys
            })
        })
    })

    ipcRenderer.on('exportFile-start', (event, arg) => {
        excelData.exportFileByWB({
            filteredData,
            excelData
        })
        ipcRenderer.send('exportFile-response', { info: '成功导出' })
    })

    ipcRenderer.on('delAllFilterTag-start', (event, arg) => {
        let activeSheetName = arg.activeSheetName,
            curColKeys = colKeys[activeSheetName],
            curSheetData = excelData[activeSheetName]

        ipcRenderer.send('generate-htmlstring-response', {
            sheetHTML: generateHTMLString({
                sheetData: curSheetData,
                colKeys: curColKeys
            })
        })

    })
}, false)

function filterHandler(arg) {
    let { filterTagList, filterWay, uniqueCols } = arg,
        tempFilteredData = Object.assign({}, excelData)
    for (let i = 0, len = excelData.sheetNameList.length; i < len; i++) {
        let curSheetName = excelData.sheetNameList[i],
            curFilterTagList = filterTagList[curSheetName],
            colKeys = excelData[curSheetName + SUFFIX_COLKEYS],
            curUniqueCols = uniqueCols[curSheetName]
        console.log('curSheetName', curSheetName)
        console.log('curFilterTagList', curFilterTagList.length)
        if (curFilterTagList.length !== 0) {
            tempFilteredData[curSheetName] = tempFilteredData[curSheetName].filter((row, index) => {
                let rowExpStr = ''
                for (let i = 0, len = curFilterTagList.length; i < len; i++) {
                    let cTag = curFilterTagList[i],
                        cFilters = cTag.filters,
                        groupId = cTag.groupId,
                        tagLogicChar = cTag.logicOperator === 'and' ? '&&' : '||',
                        oneTagResult,
                        groupExpStr = ''

                    // 遍历当前组的 filters
                    cFilters.forEach((cF, index) => {
                        let filterLogicChar = cF.logicOperator === 'and' ? '&&' : '||',
                            filterType = cF.filterType,
                            filterCol = cF.col,
                            operator = cF.operator,
                            colOperator = cF.colOperator,
                            target = cF.value,
                            needConformColIndex = cF.needConformColIndex,
                            oneFilterResult

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
                    oneTagResult = eval(groupExpStr)

                    rowExpStr = rowExpStr + tagLogicChar + oneTagResult
                    if (tagLogicChar === '||' && oneTagResult === true) {
                        break;
                    }
                }
                rowExpStr = rowExpStr.replace(/^[|&]*/ig, '')
                let rowResult = eval(rowExpStr)
                // return rowResult
                return filterWay == 0 ? rowResult : !rowResult
            })
        }
        console.log('uniqueCols', uniqueCols)
        if (curUniqueCols.length !== 0) {
            let curUniqueColKeys = curUniqueCols.map((item) => {
                return colKeys[item]
            })
            console.log('curUniqueColKeys', curUniqueColKeys)
            tempFilteredData[curSheetName] = uniqBy(tempFilteredData[curSheetName], curUniqueColKeys)
        }
    }
    return tempFilteredData
}


function uniqBy(arr, selectedColKeys) {
    let seen = {}
    return arr.filter((item) => {
        let k = key(item, selectedColKeys)
        return seen.hasOwnProperty(k) ? false : (seen[k] = true)
    })
}

function key(item, selectedColKeys) {
    let filterItem = {}
    for (var i = 0, len = selectedColKeys.length; i < len; i++) {
        let key = selectedColKeys[i]
        filterItem[key] = item[key]
    }
    return JSON.stringify(filterItem)
}