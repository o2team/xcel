'use strict';

const moment = require('moment')
const zh = require('moment/locale/zh-cn')

moment.locale('zh') // 设置时间格式为中文

let filterUtils = {
    mathOperaArr: ['>', '<', '>=', '<='],
    conditionArr: ['=', '!=', 'contain', 'notContain', 'startsWith', 'endsWith', 'regexp'],

    filterByOneOperator(args) {
        let { row, colKeys, filterCol, operator, target } = args,
            selectKey = colKeys[filterCol],
            curVal = row[selectKey],
            isNotBelongEmpty = !(operator === 'empty' || operator === 'notEmpty')
        if (isNotBelongEmpty && curVal === undefined) {
            return false
        } else {
            return this.filterUnit({ operator, curVal, target })
        }
    },
    // 双列范围逻辑的【非or、and】，即表单3.1
    filterByDoubleColsRange(args) {
        let { row, colKeys, filterCol, operator, target, needConformColIndex } = args,
            passCounter = 0

        // 判断每列中是否有一列符合单一逻辑，即3.1
        for (let i = 0, len = filterCol.length; i < len; i++) {
            let selectKey = filterCol[i],
                curKey = colKeys[selectKey],
                isCurColPassed = this.filterUnit({
                    operator,
                    curVal: row[curKey],
                    target: target
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
    filterByMultiColCalc(args) {
        // 此处 filterCol 是数组
        let { row, colKeys, filterCol, operator, target, colOperator } = args,
            rowCalcResult = this.calcMultiCol({
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
    calcMultiCol(args) {
        let { row, colOperator, colKeys, filterCol } = args,
            calcResult

        if (!colOperator.includes('time')) {
            calcResult = this.calcNum({ row, colOperator, filterCol, colKeys })
        } else {
            let date0 = moment(row[colKeys[filterCol[0]]], 'm/d/y hh:mm'),
                date1 = moment(row[colKeys[filterCol[1]]], 'm/d/y hh:mm'),
                diff = Math.abs(date1.diff(date0, 'seconds'))
            // minutes
            calcResult = Math.floor(diff / 60)
        }
        return calcResult
    },
    calcNum(args) {
        let { colOperator, row, filterCol, colKeys } = args,
            result = row[colKeys[filterCol[0]]]

        result = result === undefined ? 0 : +result
        if (isNaN(result)) return undefined
        for (let i = 1, len = filterCol.length; i < len; i++) {
            let cKey = colKeys[filterCol[i]],
                curVal = row[cKey] === undefined ? 0 : +row[cKey]

            if (isNaN(curVal)) return undefined

            switch (colOperator) {
                case '+': result += curVal; break;
                case '-': result -= curVal; break;
                case '*': result *= curVal; break;
                case '/': result /= curVal; break;
                case '%': result %= curVal; break;
                default: console.log('calcNumSet未匹配操作符')
            }
        }
        return isNaN(result) ? undefined : result
    },
    filterUnit(args) {
        let { operator, curVal, target } = args,
            isNotBelongEmpty = !(operator === 'empty' || operator === 'notEmpty')
        if (operator == undefined || (isNotBelongEmpty && target == undefined) || (isNotBelongEmpty && curVal == undefined)) {
            return false
        }
        if (!isNaN(+curVal) || !isNaN(+target)) { // +'a' 是 NaN，另外：toFixed是为了避免浮点数的不精确表示，如 0.1+0.2 = 0.30000000000000004
            // 另外toFixed 返回的是字符串类型
            curVal = typeof (+curVal) === 'number' ? +(+curVal).toFixed(12) : (+curVal)
            target = typeof (+target) === 'number' ? +(+target).toFixed(12) : (+target)
        }
        // console.log(typeof curVal, typeof operator, typeof target)
        
        switch (operator) {
            case '>': return (curVal > target); break;
            case '<': return (curVal < target); break;
            case '<=': return (curVal <= target); break;
            case '>=': return (curVal >= target); break;
            // 上面是逻辑操作符
            // 下面是字符串操作符
            // 因为= !=可用于字符串的对比，因此不放在逻辑操作符内
            // 下面的字符串方法对参数是Number也适用
            case '=': return (curVal == target); break;
            case '!=': return (curVal != target); break;
            case 'contain': return curVal.includes(target); break;
            case 'notContain': return !curVal.includes(target); break;
            case 'startsWith': return curVal.startsWith(target); break;
            case 'endsWith': return curVal.endsWith(target); break;
            case 'regexp':
                let regexp = new RegExp(target, 'ig')
                return curVal.match(regexp); break;
            case 'empty': console.log(curVal === undefined); return curVal === undefined; break;
            case 'notEmpty': return curVal !== undefined; break;
            default:
                console.log('未匹配操作符')
                return true
        }
    }
}


module.exports = filterUtils