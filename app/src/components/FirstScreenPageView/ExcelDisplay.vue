<!-- Excel -->
<template>
	<div class="excel_area">
		<div class="tabs is_boxed is_small excel_cheet_nav" 
			v-show="sheetNameList.length !== 0">
			<ul>
				<li v-for = "(sheetName, index) in sheetNameList" 
					:class="{'is_active': index == activeSheet.index}"
					@click = "changeTab(index)">
					<a href="javascript:;">
						<span>{{ sheetName }}</span>
					</a>
				</li>
			</ul>
		</div>
		<div class="tabs_body">
			<div class="drop_area content"
				v-show="sheetNameList.length < 1"
				@drop.prevent.stop="dropHandler" 
				@dragenter="dragenterHandler"
				@dragleave="dragleaveHandler"
				>
				<p class = "drop_tips">
					<svg width="18px" height="15px" viewBox="0 1 18 15" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
					    <desc>警告</desc>
					    <defs></defs>
					    <path d="M0.5,16 L17.5,16 L9,1 L0.5,16 L0.5,16 Z M10,14 L8,14 L8,12 L10,12 L10,14 L10,14 Z M10,11 L8,11 L8,7 L10,7 L10,11 L10,11 Z" id="Shape" stroke="none" fill="#D50000" fill-rule="evenodd"></path>
					</svg>当前没有选中任何Excel文件，可将文件拖拽至此区域。
				</p>
			</div>
			<sheet-of-excel v-for="(sheetName, index) in sheetNameList"
				v-show="activeSheet.index === index" 
				:sheetHTML="sheetHTML">
			</sheet-of-excel>
		</div>
	</div>
</template>


<script>
	import fs from 'fs-extra'
	import pathModule from 'path'
	import { ipcRenderer } from 'electron'
	import { isExcelFile } from '../../utils/ExcelSet'
	import { mapGetters, mapActions } from 'vuex'
	import SheetOfExcel from './SheetOfExcel'

	export default {
		components: {
			SheetOfExcel
		},
		data() {
			return {
				sheetHTML: ''
			}
		},
		mounted() {
			ipcRenderer.on('generate-htmlstring-response', (event, arg) => {
				this.sheetHTML = arg.sheetHTML
			})

			let dropArea = document.querySelector('.drop_area')
			if (dropArea) {
				dropArea.addEventListener('dragenter', dragoverHandler, false)
				dropArea.addEventListener('dragover', dragoverHandler, false)
			}
			function dragoverHandler(e) {
				e.stopPropagation()
				e.preventDefault()
				e.dataTransfer.dropEffect = 'copy'
			}
		},
		computed: {
			...mapGetters({
				activeSheet: 'getActiveSheet',
				filterTagList: 'getFilterTagList',
				filterWay: 'getFilterWay',
				sheetNameList: 'getSheetNameList',
				uniqueCols: 'getUniqueCols'
			})
		},
		methods: {
			changeTab(index) {
				this.setActiveSheet(index)
				ipcRenderer.send('changeTab-start', {
					filterTagList: this.filterTagList,
					filterWay: this.filterWay,
					curActiveSheetName: this.activeSheet.name,
					uniqueCols: this.uniqueCols
				})
			},
			dragenterHandler(e) {
				e.target.classList.add('active')
			},
			dragleaveHandler(e) {
				e.target.classList.remove('active')
			},
			dropHandler(e) {
				let files = e.dataTransfer.files
				let path = files[0].path

				if (!isExcelFile(path)) {
					this.dragleaveHandler(e)
					ipcRenderer.send('sync-alert-dialog', {
						content: '不支持该文件格式'
					})
				} else {
					this.setExcelData({
						path: path,
						type: 'node'
					})
					this.setUploadFiles(path)
				}
			},
			...mapActions([
				'setActiveSheet',
				'setExcelData',
				'setUploadFiles'
			])
		}
	}

</script>

<style lang="scss" scoped>
	.excel_area{
		display: flex;
		flex-direction: column;
		max-width: 100%;
		width: 100%;
		margin-top: 5px;
		padding: 5px;
		flex-grow: 1;

	}
	.tabs{
		flex-shrink: 0;
		flex-grow: 0;
	}

	.tabs_body{
		flex-grow: 1;
		flex-shrink: 1;
		overflow: auto;
		position: relative;
		display: block;
		overflow: auto;
		&>*{
			display: block;
			width: 100%;
			height: 100%;
		}
		&>p{
			display: inline-block;
			&.is_loading {
				padding-right: 24px;
			}
		}
	}

	.excel_cheet_nav {
		margin-bottom: 5px;
		ul {
			padding-left: 5px;
		}
	}
	
	.drop_area{
		// opacity: 0;
		font-size: 18px;
		position: relative;
		vertical-align: middle;
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		transition: background-color .25s ease-out;
		&.active {
			background-color: #2B3244;
		}
		.drop_tips {
			display: inline-block;
			font-size: 12px;
			color: #fff;
			padding: 9px 6px 9px 11px;
			line-height: 17px;
			background-color: rgba(0,0,0, .15);
			text-align: center;
			pointer-events: none;
			svg {
				vertical-align: text-top;
				margin-right: 10px;
			}
		}
		p {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
		}
	}




</style>
