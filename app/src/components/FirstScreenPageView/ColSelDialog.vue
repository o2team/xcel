<template>
	<div class="col_sel_modal" @keyup :class="{'active': colSelectDialogStatus}">
		<div class="col_sel_dialog">
			<div class="col_sel_dialog_header">
				<div>
						<svg width="22px" height="23px" viewBox="20 19 22 23" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
					    <!-- Generator: Sketch 40.3 (33839) - http://www.bohemiancoding.com/sketch -->
					    <desc>Created with Sketch.</desc>
					    <defs></defs>
					    <text id="Info---simple-line-icons" stroke="none" fill="none" font-family="simple-line-icons" font-size="22" font-weight="normal">
					        <tspan x="20" y="40" fill="#4285F4"></tspan>
					    </text>
					</svg>
					<h4>请选择列</h4>
				</div>
				<div class="selected_col_container">
					<p>{{ selectedGroupStr }}</p>
				</div>
			</div>
			<div class="col_sel_dialog_content">
				<p v-if="curColCount === 0" class="no_content_tips">请先上传Excel文件或该文件未含有列</p>
				<ul v-else>
					<li v-for="(item, index) in curColKeys" @click="toggleSelect(index + 1)" :class="{'active': selectedGroup.includes(index + 1)}">
						<div>
							<span>{{ getCharCol(index + 1) }}</span>
							<p>{{ item }}</p>
						</div>
					</li>
				</ul>
			</div>
			<div class="col_sel_dialog_footer">
				<div>
					<button type="button" @click="closeDialog">
						<svg width="28px" height="14px" viewBox="5 5 14 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
						    <defs></defs>
						    <polygon id="Shape" stroke="none" fill="#6B727D" fill-rule="evenodd" points="19 6.4 17.6 5 12 10.6 6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12"></polygon>
						</svg>
					</button>
					<button type="button" @click="submit">
						<svg width="28px" height="14px" viewBox="3 5 18 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
						    <defs></defs>
						    <polygon id="Shape" stroke="none" fill="#fff" fill-rule="evenodd" points="8.9999939 16.2 4.7999939 12 3.3999939 13.4 8.9999939 19 20.9999939 7 19.5999939 5.6"></polygon>
						</svg>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { ipcRenderer } from 'electron'
	import { getCharCol } from '../../utils/ExcelSet'
	import { getCurColKeys, getColSelectDialogStatus, getColSelectType, getCurColCount } from '../../vuex/getters'
	import { setColSelectDialogStatus } from '../../vuex/actions'
	export default {
		data() {
			return {
				selectedGroup: []
			}
		},
		vuex: {
			getters: {
				curColKeys: getCurColKeys,
				colSelectDialogStatus: getColSelectDialogStatus,
				colSelectType: getColSelectType,
				curColCount: getCurColCount
			},
			actions: {
				setColSelectDialogStatus
			}
		},
		mounted(){
			document.body.addEventListener('keyup', (event) => {
				let keyCode = event.keyCode
				if(keyCode === 27) {
					this.closeDialog()
				}
				else if(keyCode === 13) {
					this.submit()
				}
			}, false)
		},
		computed: {
			selectedGroupStr() {
				return this.selectedGroup.map((item, index) => {
					return this.getCharCol(item)
				}).join('、')
			}
		},
		methods: {
			getCharCol,
			closeDialog() {
				this.selectedGroup = []
				this.setColSelectDialogStatus(false)
			},
			submit() {
				let colSelectType = this.colSelectType,
						colSelectGroup = this.selectedGroup,
						colSelectLen = colSelectGroup.length,
						eventBus = window.eventBus,
						warmStr = ''
				if(this.curColCount === 0) {
					ipcRenderer.send('sync-alert-dialog', {
		        content: 'Excel文件未上传或未含有列'
		      })
					return
				}
				if(colSelectType === 0) {
					if(colSelectLen === 0) {
						warmStr = '单列运算逻辑需要选择一列'
					}else {
						eventBus.$emit('colSelVal4Single', colSelectGroup)
					}
				}else if(colSelectType === 1) {
					if(colSelectLen < 2) {
						warmStr = '多列运算逻辑至少选择两列'
					}else {
						eventBus.$emit('colSelVal4Multi', colSelectGroup)
					}
				}else if(colSelectType === 2) {
					if(colSelectLen !== 2) {
						warmStr = '双列运算逻辑只能选择两列'
					}else {
						eventBus.$emit('colSelVal4Double', colSelectGroup)
					}
				}

				if(warmStr.length === 0) {
					this.selectedGroup = []
					this.setColSelectDialogStatus(false)
				}else {
					ipcRenderer.send('sync-alert-dialog', {
		        content: warmStr
		      })
				}
			},
			toggleSelect(index) {
				let selectedGroup = this.selectedGroup,
						colSelectType = this.colSelectType
				if(colSelectType === 0) {
					selectedGroup.splice(0, 1, index)
				}else if(colSelectType === 1) {
					if(selectedGroup.includes(index)) {
						let i = selectedGroup.indexOf(index)
						selectedGroup.splice(i, 1)
					}else {
						selectedGroup.push(index)
					}	
				}else if(colSelectType === 2) {
					if(selectedGroup.length <= 2) {
						if(selectedGroup.includes(index)) {
							let i = selectedGroup.indexOf(index)
							selectedGroup.splice(i, 1)
						}else if(selectedGroup.length < 2) {
							selectedGroup.push(index)
						}	
					}
				}
			}
		}
	}
</script>


<style lang="scss" scoped>
	.col_sel_modal {
		position: fixed;
		top: 32px;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(0,0,0, .5);
		overflow: hidden;
		z-index: 100;
		visibility: hidden;
		transition: all .3s;
		&.active {
			visibility: visible;
		}
	}
	.selected_col_container {
		color: #fff;
	}
	.col_sel_dialog {
		position: absolute;
		left: 50%;
		transform: translate(-50%, -80%);
		width: 800px;
		height: 320px;
		background-color: #fff;
		box-shadow: 0 2px 4px rgba(0,0,0,.5);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		transition: all .3s;
		opacity: 0;
		.col_sel_modal.active & {
			transform: translate(-50%, 0);
			opacity: 1;
		}
		&_header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			flex-grow: 0;
			flex-shrink: 0;
			height: 60px;
			padding: 0 20px;
			background-color: #262626;
			>div:first-child {
				white-space: nowrap;
				margin-right: 20px;
			}
			h4, svg {
				vertical-align: middle;
			}
			h4 {
				display: inline-block;
				font-size: 24px;
				color: #fff;
			}
		}
		&_content {
			max-height: 210px;
			overflow: auto;
			flex-grow: 1;
			flex-shrink: 0;
			padding: 15px 20px;
			position: relative;
			.no_content_tips {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
			}
			ul {
				display: flex;
				flex-wrap: wrap;
			}
			li {
				font-size: 0;
				margin: 0 15px 15px 0;
				text-align: center;
				cursor: pointer;
				&.active {
					span {
						color: #fff;
						background-color: #5CB85C;
					}
				}
				span, p {
					display: inline-block;
					height: 24px;
					line-height:24px;
					font-size: 12px;
					vertical-align: middle;
				}
				span {
					min-width: 22px;
					color: #C8CCCF;
					background-color: #2B3244;
				}
				p {
					min-width: 122px;
					color: #D8D8D8;
					background-color: #9B9B9B;
					padding: 0 6px;
				}
			}
		}
		&_footer {
			flex-grow: 0;
			flex-shrink: 0;
			>div {
				display: flex;
				align-items: stretch;
				height: 50px;
			}
			button {
				flex-grow: 1;
				-webkit-appearance: normal;
				outline: none;
				border: 0;
				background-color: #D8D8D8;
				cursor: pointer;
				&:last-child {
					background-color: #4285F4;
					color: #fff;
				}
			}
		}
	}
</style>