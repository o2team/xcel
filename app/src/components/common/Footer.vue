
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
			<li class="btn update_btn" title="检查更新"
				@click="checkForUpdate"
				:class="{active: isShowUpdateDialog}">
				<i class="fa fa-cloud-download"></i>
			</li>
		</ul>
		<div>
			<p class="summary_info" v-show="hasFile">
				筛选后数据为 <em>{{ curFilterTagListCount !== 0 ? curFilRowCount : curOriRowCount }}</em> 行，原始记录为 <em>{{ curOriRowCount }}</em> 行，共 <em>{{ curFilterTagListCount }}</em> 个{{ filterWay == 0 ? "保留" : "剔除"}}</span>条件
			</p>
			<img src="./assets/O2-icon.png" alt="O2_logo" @click="openExternal('aotu')">
		</div>
	</footer>
</template>
<script>
	import { remote } from 'electron'
	import os from 'os'
	import pathModule from 'path'
	import { ipcRenderer } from 'electron'
	import { isExcelFile } from '../../utils/ExcelSet'
	import request from 'request'
	import compareVersions from 'compare-versions'
	import { openExternal } from '../../utils/openExternal'
	import { appInfo, getDownloadUrl } from '../../utils/appInfo'
	import { 
		getSideBarStatus,
		getFilterPanelStatus,
		getFilterWay,
		getCurOriRowCount,
		getCurFilRowCount,
		getCurFilterTagListCount,
		getKeepCurVersion,
		getUpdateDialogStatus
	} from '../../vuex/getters'
	import { 
		toggleSideBar,
		toggleFilterPanelStatus,
		setExcelData,
		setUploadFiles,
		toggleUpdateDialog, setUpdateUrl, setUpdateVersion, setUpdateNotes, setUpdatePubDate, setHasNewStatus,
		setKeepVersionStatus
	} from '../../vuex/actions'

	let firstTime = true
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
				curFilterTagListCount: getCurFilterTagListCount,
				isKeepCurVersion: getKeepCurVersion,
				isShowUpdateDialog: getUpdateDialogStatus
			},
			actions: {
				toggleSideBar,
				toggleFilterPanelStatus,
				setExcelData, 
				setUploadFiles,
				toggleUpdateDialog, setUpdateUrl, setUpdateVersion, setUpdateNotes, setUpdatePubDate, setHasNewStatus,
				setKeepVersionStatus
			}
		},
		computed: {
			hasFile(){
				return this.curOriRowCount > 0
			}
		},
		created() {
			ipcRenderer.on('open-file-response', (event, path) => {
				if(isExcelFile(path)) {
					this.setExcelData({
						path: path,
						type: 'node'
					})
					this.setUploadFiles(path)
				} else {
					ipcRenderer.send('sync-alert-dialog', {
		        content: '不支持该文件格式'
		      })
				}
			})
			if(!this.isKeepCurVersion && firstTime) {
        this.checkUpdate(false)
        firstTime = false
      }
		},
		methods: {
			openExternal,
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
			},
			checkForUpdate() {
				this.checkUpdate(true)
				this.setKeepVersionStatus(false)
			},
			checkUpdate(isClick) {
        let that = this
        console.log(appInfo.updateUrl)
        request({
          url: appInfo.updateUrl,
          method: 'GET'
        }, function(err, response, body) {
          if(err) {
            console.log(err)
          }
          try {
          	let statusCode = response.statusCode
          	if(statusCode === 200) {
	            let res = JSON.parse(response.body)
	            /**
	             *  1即小于，表示当前版本比服务器上的版本还要新
	             *  0即等于，表示已是最新版
	             *  -1即大于，表示有更新版本
	             */
	            let compareResult = compareVersions(appInfo.app_version, res.name)
	            console.log('compareResult', compareResult)
	            console.log('appInfo.app_version', appInfo.app_version)
	            console.log('res.name', res.name)
	            if(compareResult === -1) {
	            	// 由于 github 对于国内用户下载速度太慢，所以要切换至国内
	            	let downloadUrl = getDownloadUrl(res.name)
	            	console.log(downloadUrl)
	            	if(downloadUrl === undefined) {
	            		downloadUrl = res.url
	            	}
	              that.toggleUpdateDialog(true)
	              that.setUpdateUrl(downloadUrl)
	              that.setUpdateVersion(res.name)
	              that.setUpdateNotes(res.notes)
	              that.setUpdatePubDate(res.pub_date)
	              that.setHasNewStatus(true)
	            }
          	} else if(statusCode === 204) {
          		console.log('无新版本')
          		if(isClick) {
          			that.toggleUpdateDialog(true)
          		} 
              that.setHasNewStatus(false)
          	}
          } catch(e) {
            console.log('version 解析失败')
            console.log(e)
          }
        })
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
		z-index: 120;
		>div{
			flex-wrap: nowrap;
			white-space: nowrap;
		}
		.btn_group{
			font-size: 0;
			display: flex;
			// justify-content: space-between;
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
				margin-right: 15px;
				cursor: pointer;
				transition: color .2s;
				
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