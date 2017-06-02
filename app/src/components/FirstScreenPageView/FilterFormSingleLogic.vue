<template>
	<form @submit.prevent="addFilterHandler" @keyup.stop>
		<table class="table">
			<tbody>
				<tr>
					<td>单列运算逻辑</td>
					<td>
						<span class="select">
							<select v-model="logicOperator">
								<option value="and">且</option>
								<option v-show="!curFilterTagListCount == 0" value="or">或</option>
							</select>
							<p class="val_mask">{{ getLogicOperatorWords(logicOperator)}}</p>
						</span>
					</td>
					<td>
						<p class="col_placeholder" @click="showColSelectDialog">
							{{operatorCol.length === 0 ? "请选择列" : getCharCol(operatorCol[0])}}
						</p>
					</td>
					<td>
						<span class="select">
							<select v-model="operator">
								<option v-for="op in filterOptions"
									:value="op.char">
									{{ op.words }}
								</option>
							</select>
							<p class="val_mask">{{ getOperatorWords(filterOptions, operator) }}</p>
						</span>
					</td>
					<td class="placeholder_td"></td>
					<td>
						<input type="text" placeholder="请填写运算符的值"
							:disabled="operator === 'empty' || operator === 'notEmpty'"
							v-model="operatorVal">
					</td>
					<td>
						<group-select :group-id="groupId"
							@changeSelect="changeSelHandler">
						</group-select>
					</td>
					<td>
						<button type="submit">添加</button>
					</td>
				</tr>
			</tbody>
		</table>
	</form>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {
  getCharCol,
  getLogicOperatorWords,
  getOperatorWords,
  getFilterWordsPrimitive
} from '../../utils/ExcelSet'
import GroupSelect from './GroupSelect'
import { ipcRenderer } from 'electron'

export default {
  components: {
    GroupSelect
  },
  data () {
    return {
      operatorVal: '',
      operatorCol: [],
      operator: '>',
      subFilterOperator: '',
      logicOperator: 'and',
      groupId: -1
    }
  },
  mounted () {
    window.eventBus.$on('colSelVal4Single', colSelectGroup => {
      console.log('colSelectGroup', colSelectGroup)
      this.operatorCol = colSelectGroup
    })
  },
  watch: {
    curFilterTagListCount () {
      if (this.curFilterTagListCount === 0) {
        this.logicOperator = 'and'
      }
    },
    operator () {
      if (this.operator === 'empty' || this.operator === 'notEmpty') {
        /* eslint-disable no-undefined */
        this.operatorVal = undefined
        /* eslint-enable */
      }
    }
  },
  computed: {
    ...mapGetters({
      filterOptions: 'getFilterOptions',
      curColCount: 'getCurColCount',
      curFilterTagListCount: 'getCurFilterTagListCount'
    })
  },
  methods: {
    getCharCol,
    getLogicOperatorWords,
    getOperatorWords,
    getFilterWordsPrimitive,
    changeSelHandler (groupId) {
      this.groupId = groupId
    },
    showColSelectDialog () {
      this.setColSelectType(0)
      this.setColSelectDialogStatus(true)
    },
    addFilterHandler () {
      let filterObj = {}
      let filterWords = ''
      const curCol = this.operatorCol
      const operator = this.operator
      const operatorWords = this.getOperatorWords(this.filterOptions, operator)
      const opVal = this.operatorVal && this.operatorVal.trim()

      if (!this.validateForm({ curCol, opVal })) {
        return
      }

      const preStr = `第${this.getCharCol(curCol)}列的值`
      filterWords = preStr + this.getFilterWordsPrimitive({
        operator,
        operatorWords,
        val: opVal
      })

      filterObj = {
        filterType: 0,
        groupId: this.groupId,
        logicOperator: this.logicOperator,
        col: curCol,
        operator: this.operator,
        value: opVal,
        filterWords
      }
      console.log('filterObj', filterObj)
      this.addFilter(filterObj)
      this.operatorVal = ''
      this.operator = '>'
      this.operatorCol = []
      this.groupId = -1
    },
    validateForm ({ curCol, opVal }) {
      let isValidated = false
      let tipWords = '单列运算逻辑：'
      console.log('opVal', opVal)
      if (curCol.length === 0) {
        tipWords += '请选择列'
      } else if (typeof opVal !== 'undefined' && opVal.length === 0) {
        console.log('哈哈哈')
        tipWords += '请填写运算符的值'
      } else {
        isValidated = true
      }

      if (!isValidated) {
        ipcRenderer.send('sync-alert-dialog', {
          content: tipWords
        })
        return false
      }
      return true
    },
    ...mapActions([
      'setColSelectDialogStatus',
      'setColSelectType',
      'addFilter'
    ])
  }
}
</script>
