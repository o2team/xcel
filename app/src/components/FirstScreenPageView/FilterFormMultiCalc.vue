<template>
	<form @submit.prevent="addFilterHandler" @keyup.stop>
		<table class="table">
			<tbody>
				<tr>
					<td>多列运算逻辑</td>
					<td>
						<span class="select">
							<select v-model="logicOperator">
								<option value="and">且</option>
								<option v-show="!curFilterTagListCount == 0" value="or">或</option>
							</select>
							<p class="val_mask">{{ getLogicOperatorWords(logicOperator) }}</p>
						</span>
					</td>
					<td>
						<p class="col_placeholder" @click="showColSelectDialog">
							{{operatorCol.length === 0 ? "请选择列" : formatColGroup}}
						</p>
					</td>
					<td>
						<span class="select">
							<select v-model="colOperatorSelect">
								<option v-for="op in colOperator" 
									:value="op.char">
									{{ op.words }}
								</option>
							</select>
							<p class="val_mask">{{ getColArithmeticOperatorWords( colOperator, colOperatorSelect) }}</p>
						</span>
					</td>
					<td>
						<span class="select">
							<select v-model="operator">
								<option v-for="op in filteredOpt" 
									:value="op.char">
									{{ op.words }}
								</option>
							</select>
							<p class="val_mask">{{ getOperatorWords( filterOptions, operator) }}</p>
						</span>
					</td>
					<td>
						<div>
							<input type="text" placeholder="请填写运算符的值" v-model="operatorVal">
						</div>
					</td>
					<td>
						<group-select :group-id="groupId" @changeSelect='changeSelHandler'></group-select>
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
	import { colOperator, getNumCol, getCharCol, getOperatorWords, getColOperatorWords, getColArithmeticOperatorWords, getLogicOperatorWords, getFilterWordsPrimitive } from '../../utils/ExcelSet'
	import { getFilterOptions, getCurFilterTagListCount } from '../../vuex/getters'
	import { addFilter, setColSelectDialogStatus, setColSelectType } from '../../vuex/actions'
	import GroupSelect from './GroupSelect'
	import { ipcRenderer } from 'electron'

	export default{
		components: {
			GroupSelect
		},
		data(){
			return {
				operatorVal: '',
				operatorCol: [], // 最终会转为数组
				operator: '>',
				colOperatorSelect: '+',
				logicOperator: 'and',
				colOperator: colOperator,
				groupId: -1
			}
		},
		vuex: {
			getters: {
				filterOptions: getFilterOptions,
				curFilterTagListCount: getCurFilterTagListCount
			},
			actions: {
				setColSelectDialogStatus,
				setColSelectType,
				addFilter
			}
		},
		mounted() {
			window.eventBus.$on('colSelVal4Multi', (colSelectGroup) => {
				this.operatorCol = colSelectGroup
			})
		},
		watch: {
			curFilterTagListCount(){
				if(this.curFilterTagListCount == 0) {
					this.logicOperator = 'and'
				}
			}
		},
		computed: {
			formatColGroup() {
				console.log(this.operatorCol)
				return this.operatorCol.map((col, index) => {
					return this.getCharCol(col)
				}).join(',')
			},
			filteredOpt() {
				return this.filterOptions.filter((opt, index) => {
					if(opt.char === 'empty' || opt.char === 'notEmpty') {
						return false
					}else {
						return true
					}
				})
			}
		},
		methods:{
			getNumCol,
			getCharCol,
			getOperatorWords,
			getColArithmeticOperatorWords,
			getLogicOperatorWords,
			getFilterWordsPrimitive,
			getColOperatorWords,
			changeSelHandler(groupId) {
				this.groupId = groupId
			},
			setMultiColInput(arg) {
				this.operatorCol = arg
			},
			showColSelectDialog() {
				this.setColSelectType(1)
				this.setColSelectDialogStatus(true)
			},
			addFilterHandler(){
				let filterObj = {},
					filterWords = '',
					curCols = this.operatorCol,
					operator = this.operator,
					operatorWords = this.getOperatorWords(this.filterOptions, operator),
					opVal = this.operatorVal.trim(),
					colOperatorSelect = this.colOperatorSelect,
					colOperatorWords = this.getColOperatorWords(colOperator, colOperatorSelect)

				if(!this.validateForm({curCols, opVal, colOperatorSelect})) {
					return
				}

				let colText = '' 
				curCols.forEach((col, index) => {
					colText += `, ${getCharCol(col)}`
				})
				let preStr = `第${colText.slice(2)}列的值${colOperatorWords}`

				filterWords = preStr + this.getFilterWordsPrimitive({
					operator,
					colOperatorWords,
					operatorWords,
					val: opVal,
					colOperatorSelect
				})

				filterObj = {
					filterType: 1,
					groupId: this.groupId,
					logicOperator: this.logicOperator,
					col: curCols.map((col, index) => {
						return col
					}),
					operator: this.operator,
					value: opVal,
					filterWords: filterWords,
					colOperator: this.colOperatorSelect
				}

				this.addFilter(filterObj)
				this.operatorCol = []
				this.operatorVal = ''
				this.groupId = -1
				this.operator = '>'
			},
			validateForm(args){
				let { curCols, opVal, colOperatorSelect } = args,
						isValidated = false,
						tipWords = '多列运算逻辑：'

				if(curCols.length === 0) {
					tipWords += '请填写列'
				}else if(curCols.length < 2) {
					tipWords += '至少填写两列'
				}else if(opVal.length === 0) {
					tipWords += '请填写运算符'
				}else if(colOperatorSelect.includes('time') && curCols.length > 2) {
					tipWords += '中的时间相关操作只能选择两列'
				}else {
					isValidated = true
				}
				
				if(!isValidated) {
					ipcRenderer.send('sync-alert-dialog', {
						content: tipWords
					})
					return false
				}else {
					return true
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	
</style>