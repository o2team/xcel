<template>
	<nav class="file_list_container">
	  <div class="file_list">
	  	<ul>
	  		<li title="双击文件名即可导入"
		  		:class="{cur_file: file.path === fileList[0].path}"
	  			v-for="(file, index) in fileListByQuery" 
	  			@dblclick="confirmRead(file.path ,index)">
	  			<span>{{ file.extname.replace(/^./, "") }}</span>
	  			<p>{{ file.name }}</p>
	  			<button class="btn del_btn" @click="confirmDel(index)">删除</button>
	  		</li>
	  	</ul>
	  </div>
	</nav>
</template>


<script>
	import xlsx from 'xlsx'
	import fs from 'fs'
	import { isExcelFile } from '../../utils/ExcelSet'
	import { remote, ipcRenderer } from 'electron'
	import { mapGetters, mapActions } from 'vuex'

	export default {
		data() {
			return {
				filterFileList: [],
				curLoadingIndex: -1
			}
		},
		computed: {
			fileListByQuery() {
				return this.filterByQuery(this.fileList, this.curSearchVal)
			},
			...mapGetters({
				fileList: 'getUploadFiles',
				curSearchVal: 'getCurSearchVal'
			})
		},
		methods: {
			filterByQuery(fileList, query) {
				if (query.trim().length === 0) return fileList
				let filterRegExp = new RegExp(query, 'gi')
				return fileList.filter((file, index) => {
					if (file.name.match(filterRegExp)) return true
				})
			},
			filterByType(fileList, type) {
				if (type.toUpperCase() === 'ALL') return fileList
				let filterRegExp = new RegExp((type + '$'), 'gi')
				return fileList.filter(function (file, index) {
					if (file.name.match(filterRegExp)) return true
				});
			},
			confirmRead(path, index) {
				if (!isExcelFile(path)) {
					ipcRenderer.send('sync-alert-dialog', {
						content: '不支持该文件格式'
					})
					this.confirmDel(index, '当前工具不支持该文件格式，是否删除该记录？')
				} else {
					remote.dialog.showMessageBox({
						type: 'question',
						buttons: ['确定', '取消'],
						defaultId: 0,
						title: 'XCel',
						message: '导入该文件会覆盖目前的筛选结果，是否确认要导入？'
					}, (btnIndex) => {
						if (btnIndex === 0) {
							fs.stat(path, (err, stats) => {
								if (stats && stats.isFile()) {
									this.setExcelData({
										path: path,
										type: 'node'
									})
									this.setUploadFiles(path)
								} else {
									this.confirmDel(index, '当前文件不存在，是否删除该记录？')
								}
							})
						}
					})
				}
			},
			confirmDel(index, content) {
				remote.dialog.showMessageBox({
					type: 'question',
					buttons: ['确定', '取消'],
					defaultId: 0,
					title: 'XCel',
					message: '是否要删除该文件记录？'
				}, (btnIndex) => {
					if (btnIndex === 0) {
						this.delUploadFiles(index)
					}
				})
			},
			...mapActions([
				'changeFileType',
				'setExcelData',
				'setActiveSheet',
				'setUploadFiles',
				'delUploadFiles'
			])
		}
	}
</script>

<style scoped>
	.del_btn{
		background-color: #FF4081;
		color: #fff;
		border: 0;
		outline: 0;
		font-size: 12px;
		cursor: pointer;
	}
</style>
<style lang="scss" scoped>
	.file_list_container {
		padding-left: 24px;
		.file_list {
			li {
				display: flex;
				align-items: center;
				height: 48px;
				justify-content: space-between;
				-webkit-user-select: none;
				user-select: none;
				&:hover .del_btn{
					display: block;
				}
				&:not(:first-child) p {
						color: rgba(0,0,0, .87);
				}
				&.cur_file {
					span {
						background-color: #4285F4;
					}
					p {
						color: #4285F4;
					}
				}
				p {
					flex-grow: 1;
					font-size: 13px;
					text-align: left;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					padding-right: 10px;
				}
				span {
					display: inline-block;
					font-size: 10px;
					margin-right: 16px;
					width: 40px;
					text-align: center;
					border-radius: 2px;
					line-height: 18px;
					background-color: #6B727D;
					color: #fff;
					flex-shrink: 0;
				}
				.btn {
					margin-right: 10px;
					display: none;
					flex-shrink: 0;
				}
			}
		}
	}

</style>