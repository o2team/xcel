import * as types from '../mutation-types'
import * as ExcelSet from '../../utils/ExcelSet'
import { getLocal, setLocal } from '../../utils/localStorageSet'
import _ from 'lodash'
import { ipcRenderer } from 'electron'

const SUFFIX_COLKEYS = '_headers'

let filterWay = getLocal('filterWay')
                ? getLocal('filterWay') : 0

const state = {
  filterTagList: {}, // 筛选条件列表
  oriRow: {},
  filRow: {},
  colKeys: {},
  activeSheet: {
  	index: 0,
  	name: ''
  },
  sheetNameList: [],
  filterWay, // 0 是保留, 1 是剔除
  isShowFillterPanel: false,
  isShowColSelectDialog: false,
  colSelectType: -1, // 0：单列运算 1：多列运算 2：双列范围逻辑
  filterOptions: [
    {
  		char: '>',
  		words: '大于'
  	},{
  		char: '<',
  		words: '小于'
  	},{
  		char: '>=',
  		words: '大于或等于'
  	},{
  		char: '<=',
  		words: '小于或等于'
  	},{
  		char: '=',
  		words: '等于'
  	},{
      char: '!=',
      words: '不等于'
    },{
  		char: 'contain',
  		words: '包含'
  	},{
      char: 'notContain',
      words: '不包含'
    },{
  		char: 'startsWith',
  		words: '开头字符'
  	},{
  		char: 'endsWith',
  		words: '结束字符'
  	},{
  		char: 'regexp',
  		words: '正则表达式'
  	},{
      char: 'empty',
      words: '为空'
    }, {
      char: 'notEmpty',
      words: '不为空'
    }
  ]
}

const mutations = {
  [types.SET_EXCEL_BASE_INFO] (state, arg) {
    Object.keys(arg).forEach((key, index) => {
      state[key] = arg[key]
    })
  },

  [types.ADD_FILTER] (state, filter) {
    let curSheetName = state.activeSheet.name,
        filterTagList = state.filterTagList
  	if(state.sheetNameList && state.sheetNameList.length > 0){
  		let tempTagList = Object.assign({}, state.filterTagList),
          curTagList = tempTagList[curSheetName],
          isHasSameGroup = false
      
      // 判断当前filter是否存在组
      // 若存在，则判断是否存在同类组
      if( filter.groupId != '-1' ) {
        curTagList.forEach((item, index) => {
          // 若存在同类组
          if( filter.groupId === item.groupId ) {
            item.filters.push(filter)
            isHasSameGroup = true
            return true // as break
          }
        })
      }

      // 若不存在 或 找不到同类组
      if(!isHasSameGroup) {
        let filterObj = {
          groupId: filter.groupId,
          logicOperator: filter.logicOperator,
          filters: [filter]
        }
       
        curTagList.push(filterObj)
      }

	  	state.filterTagList = tempTagList
      
      tempTagList = null
  	}else{
      ipcRenderer.send('sync-alert-dialog', {
        content: '还没上传相应的Excel文件'
      })
    }
  },

  [types.DEL_FILTER] (state, args) {
    let curSheetName = state.activeSheet.name,
		    tempTagList = Object.assign({}, state.filterTagList),
        index = args.index,
        curUniqueCols = args.curUniqueCols

    tempTagList[curSheetName].splice(index, 1)
  	state.filterTagList = tempTagList

  	// 然后进行具体的过滤操作
  	let len = state.filterTagList[curSheetName].length
    if(len === 0 && curUniqueCols.length === 0) {
      ipcRenderer.send('delAllFilterTag-start', {
        curActiveSheetName: curSheetName
      })
      state.filRow[curSheetName] = state.oriRow[curSheetName]
    }
  },
  
  [types.SET_ACTIVE_SHEET] (state, index) {
  	state.activeSheet = {
  		index,
  		name: state.sheetNameList[index]
  	}
  },

  [types.SET_FILTERED_DATA] (state, data) {
    state.filRow = data
  },

  [types.SET_FILTER_WAY] (state, val) {
    state.filterWay = val
    setLocal('filterWay', val)
  },

  [types.TOGGLE_FILTER_PANEL_STATUS] (state, val) {
    if(_.isBoolean(val)) {
      state.isShowFillterPanel = val
    }else{
      state.isShowFillterPanel = !state.isShowFillterPanel
    }
  },

  [types.SET_COL_SELECT_DIALOG_STATUS] (state, val) {
    state.isShowColSelectDialog = val
  },

  [types.SET_COL_SELECT_TYPE] (state, val) {
    state.colSelectType = val
  }

}

export default {
  state,
  mutations
}


