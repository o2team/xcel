export function getLocal (key) {
  const localStorage = window.localStorage
  let valStr

  if (typeof key !== 'undefined' && key !== null) {
    valStr = localStorage.getItem(key)
  } else {
    return false
  }

  if (valStr !== 'undefined' && valStr !== 'null') {
    try {
      return JSON.parse(valStr)
    } catch (e) {
      console.log(`localStorage 的 ${key} 属性解析失败`)
      return false
    }
  } else {
    return false
  }
}

export function setLocal (key, val) {
  const localStorage = window.localStorage

  if (typeof key !== 'undefined' && key !== null) {
    try {
      localStorage.setItem(key, JSON.stringify(val))
    } catch (e) {
      console.log(`localStorage 的 ${key}:${val}序列化失败`)
      return false
    }
  } else {
    console.log(`localStorage 的 ${key} 是非法值 undefined/null`)
    return false
  }
}
