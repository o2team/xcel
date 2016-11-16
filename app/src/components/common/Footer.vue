<template>
	<footer class="footer">
		<ul class="btn_group">
			<li class="btn search_btn" title="搜索文件"
				v-show="!isShowInstruction" 
				@click="focusSearchInput"
				:class="{active: isShowSideBar}">
				<i class="fa fa-search"></i>
			</li>
			<li class="btn upload_btn" title="上传文件"
				 v-show="!isShowInstruction"
				 @click="handleFile">
				<i class="fa fa-upload"></i>
			</li>
			<li class="btn filter_btn" title="添加筛选条件" 
				v-show="!isShowInstruction"
				@click="toggleFilterPanelStatus"
				:class="{active: isShowFilterPanel}">
				<i class="fa fa-filter"></i>
			</li>
			<li class="btn instruction_btn" title="使用说明" 
				:class="{'active': isShowInstruction}" 
				@click="toggleView">
				<i class="fa fa-info"></i>
			</li>
		</ul>
		<div>
			<p class="summary_info" v-show="hasFile">
				筛选后数据为 <em>{{ curFilterTagListCount !== 0 ? curFilRowCount : curOriRowCount }}</em> 行，原始记录为 <em>{{ curOriRowCount }}</em> 行，共 <em>{{ curFilterTagListCount }}</em> 个{{ filterWay == 0 ? "保留" : "剔除"}}</span>条件
			</p>
			<img src="./assets/O2-icon.png" alt="O2_logo" @click="openAOTU">
		</div>
	</footer>
</template>

<script>
	import { shell } from 'electron'
	import pathModule from 'path'
	import { ipcRenderer } from 'electron'
	import { 
		getSideBarStatus,
		getFilterPanelStatus,
		getFilterWay,
		getCurOriRowCount,
		getCurFilRowCount,
		getCurFilterTagListCount
	} from '../../vuex/getters'
	import { 
		toggleSideBar,
		toggleFilterPanelStatus,
		setExcelData,
		setUploadFiles
	} from '../../vuex/actions'

	const AOTU_URL = 'https://aotu.io/'
	export default {
		data(){
			return {
				isShowInstruction: this.$route.name === 'instructions'
			}
		},
		vuex: {
			getters: {
				isShowFilterPanel: getFilterPanelStatus,
				isShowSideBar: getSideBarStatus,
				filterWay: getFilterWay,
				curOriRowCount: getCurOriRowCount,
				curFilRowCount: getCurFilRowCount,
				curFilterTagListCount: getCurFilterTagListCount
			},
			actions: {
				toggleSideBar,
				toggleFilterPanelStatus,
				setExcelData, 
				setUploadFiles
			}
		},
		computed: {
			hasFile(){
				return this.curOriRowCount > 0
			}
		},
		created() {
			ipcRenderer.on('open-file-response', (event, path) => {
				this.setExcelData({
					path: path,
					type: 'node'
				})
				this.setUploadFiles(path)
			})
		},
		methods: {
			openAOTU() {
				shell.openExternal(AOTU_URL)
			},
			toggleView(){
				let curRouteName = this.$route.name
				if(curRouteName === 'instructions') {
					this.$router.push('index')
				}else{
					this.$router.push('instructions')
				}
			},
			focusSearchInput(){
				let searchInput = document.getElementById('search_file_input')
				this.toggleSideBar()
				if(this.isShowSideBar){
					this.$nextTick(() => {
						searchInput && searchInput.focus()
					})
				}
			},
			handleFile(e) {
				ipcRenderer.send('sync-openFile-dialog')
			}
		}
	}
</script>

<style lang="scss" scoped>
	input[type="file"] {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		height: 24px;
		opacity: 0;
	}

	.footer{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 24px;
		height: 56px;
		background-color: #262626;
		position: relative;
		z-index: 101;
		>div{
			flex-wrap: nowrap;
			white-space: nowrap;
		}
		.btn_group{
			font-size: 0;
			display: flex;
			justify-content: space-between;
			min-width: 120px;
			max-width: 150px;
			width: 30%;
			margin-right: 20px;
			li {
				width: 24px;
				height: 24px;
				display: inline-block;
				background-color: #4285F4;
				color: #000;
				font-size: 12px;
				border-radius: 50%;
				white-space: nowrap;
				flex-shrink: 0;
				text-align: center;
				line-height: 24px;
				position: relative;
				cursor: pointer;
				transition: color .2s;
				&:not(:last-child) {
					margin-right: 2.5%;
				}
				&.active {
					color: #fff;
				}
			}
		}
		.summary_info {
			font-size: 12px;
			color: #fff;
			display: inline-block;
			vertical-align: middle;
			white-space: nowrap;
			&+img{
				width: 24px;
				height: 24px;
				cursor: pointer;
				vertical-align: middle;
				border-radius: 50%;
				margin-left: 5px;
			}
			em {
				font-style: normal;
				text-decoration: underline;				
			}
		}
		.upload_btn{
			overflow: hidden;
		}
	}
</style>