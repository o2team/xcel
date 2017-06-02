'use strict'

module.exports = function generateHTMLString ({ sheetData, colKeys }) {
  let resultHeadStr = '<tr><td>1</td>'
  let resultBodyStr = ''

  colKeys.forEach((row, index) => {
    resultHeadStr += `<td>${row}</td>`
  })
  resultHeadStr += '</tr>'

  for (let i = 0, len = Math.min(sheetData.length, 30); i < len; i++) {
    let resultTrStr = `<tr><td>${i + 2}</td>`

    for (let j = 0, len = colKeys.length; j < len; j++) {
      const col = colKeys[j]
      let val = sheetData[i][col]
      if (typeof val === 'undefined') val = ''
      resultTrStr += `<td title="${i + 2}行${getCharCol(j)}列">${val}</td>`
    }
    resultTrStr += '</tr>'
    resultBodyStr += resultTrStr
  }

  sheetData = null
  colKeys = null
  return (resultHeadStr + resultBodyStr)
}

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
