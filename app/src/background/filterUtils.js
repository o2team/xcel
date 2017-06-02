'use strict'

const moment = require('moment')

moment.locale('zh') // 设置时间格式为中文

const filterUtils = {
  mathOperaArr: ['>', '<', '>=', '<='],
  conditionArr: ['=', '!=', 'contain', 'notContain', 'startsWith', 'endsWith', 'regexp'],

  filterByOneOperator ({ row, colKeys, filterCol, operator, target }) {
    const selectKey = colKeys[filterCol]
    const curVal = row[selectKey]
    const isNotBelongEmpty = !(operator === 'empty' || operator === 'notEmpty')
    if (isNotBelongEmpty && typeof curVal === 'undefined') {
      return false
    }
    return this.filterUnit({ operator, curVal, target })
  },
    // 双列范围逻辑的【非or、and】，即表单3.1
  filterByDoubleColsRange ({ row, colKeys, filterCol, operator, target, needConformColIndex }) {
    let passCounter = 0

        // 判断每列中是否有一列符合单一逻辑，即3.1
    for (let i = 0, len = filterCol.length; i < len; i++) {
      const selectKey = filterCol[i]
      const curKey = colKeys[selectKey]
      const isCurColPassed = this.filterUnit({
        operator,
        curVal: row[curKey],
        target
      })

      if (isCurColPassed) {
        passCounter++
      }
      if (passCounter >= needConformColIndex) {
        return true
      }
    }
    return false
  },
    // 第二个表单：多列运算逻辑
  filterByMultiColCalc ({ row, colKeys, filterCol, operator, target, colOperator }) {
        // 此处 filterCol 是数组
    const rowCalcResult = this.calcMultiCol({
      row,
      colOperator,
      filterCol,
      colKeys
    })

    return this.filterUnit({
      operator,
      curVal: rowCalcResult,
      target
    })
  },
    // 计算每行是否符合要求
  calcMultiCol ({ row, colOperator, colKeys, filterCol }) {
    let calcResult

    if (!colOperator.includes('time')) {
      calcResult = this.calcNum({ row, colOperator, filterCol, colKeys })
    } else {
      const date0 = moment(row[colKeys[filterCol[0]]], 'm/d/y hh:mm')
      const date1 = moment(row[colKeys[filterCol[1]]], 'm/d/y hh:mm')
      const diff = Math.abs(date1.diff(date0, 'seconds'))
      // minutes
      calcResult = Math.floor(diff / 60)
    }
    return calcResult
  },
  calcNum ({ colOperator, row, filterCol, colKeys }) {
    let result = row[colKeys[filterCol[0]]]

    result = typeof result === 'undefined' ? 0 : +result
    if (isNaN(result)) return
    for (let i = 1, len = filterCol.length; i < len; i++) {
      const cKey = colKeys[filterCol[i]]
      const curVal = typeof row[cKey] === 'undefined' ? 0 : +row[cKey]

      if (isNaN(curVal)) return

      switch (colOperator) {
        case '+': result += curVal; break
        case '-': result -= curVal; break
        case '*': result *= curVal; break
        case '/': result /= curVal; break
        case '%': result %= curVal; break
        default: console.log('calcNumSet未匹配操作符')
      }
    }
    if (isNaN(result)) return
    return result
  },
  filterUnit ({ operator, curVal, target }) {
    const isNotBelongEmpty = !(operator === 'empty' || operator === 'notEmpty')
    let result
    if (typeof operator === 'undefined'
      || (isNotBelongEmpty && typeof target === 'undefined')
      || (isNotBelongEmpty && typeof curVal === 'undefined')) {
      return false
    }
    if (!isNaN(+curVal) || !isNaN(+target)) { // +'a' 是 NaN，另外：toFixed是为了避免浮点数的不精确表示，如 0.1+0.2 = 0.30000000000000004
      // 另外toFixed 返回的是字符串类型
      curVal = typeof (+curVal) === 'number' ? +(+curVal).toFixed(12) : (+curVal)
      target = typeof (+target) === 'number' ? +(+target).toFixed(12) : (+target)
    }
    // console.log(typeof curVal, typeof operator, typeof target)

    switch (operator) {
      case '>': {
        result = (curVal > target)
        break
      }
      case '<': {
        result = (curVal < target)
        break
      }
      case '<=': {
        result = (curVal <= target)
        break
      }
      case '>=': {
        result = (curVal >= target)
        break
      }
      case '=': {
        result = (curVal.toString() === target.toString())
        break
      }
      case '!=': {
        result = (curVal.toString() !== target.toString())
        break
      }
      case 'contain': {
        result = curVal.includes(target)
        break
      }
      case 'notContain': {
        result = !curVal.includes(target)
        break
      }
      case 'startsWith': {
        result = curVal.startsWith(target)
        break
      }
      case 'endsWith': {
        result = curVal.endsWith(target)
        break
      }
      case 'regexp': {
        const regexp = new RegExp(target, 'ig')
        result = curVal.match(regexp)
        break
      }
      case 'empty': {
        result = (typeof curVal === 'undefined')
        break
      }
      case 'notEmpty': {
        result = (typeof curVal !== 'undefined')
        break
      }
      default: {
        console.log('未匹配操作符')
        result = true
      }
    }
    return result
  }
}

module.exports = filterUtils
