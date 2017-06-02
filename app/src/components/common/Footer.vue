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
				@click="clickFilterBtn"
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
				筛选后数据为
				<em>{{ Math.min(curFilRowCount, curOriRowCount) }}</em>
				行，原始记录为
				<em>{{ curOriRowCount }}</em>
				行，共
				<em>{{ filterAcount }}</em>
				个{{ filterWay == 0 ? "保留" : "剔除"}}条件
			</p>
			<img src="../assets/O2-icon.png" alt="O2_logo" title="凹凸实验室" @click="openExternal('aotu')">
		</div>
	</footer>
</template>

<script>
import { ipcRenderer } from 'electron'
import { isExcelFile } from '../../utils/ExcelSet'
import request from 'request'
import compareVersions from 'compare-versions'
import { openExternal } from '../../utils/openExternal'
import { appInfo, getDownloadUrl } from '../../utils/appInfo'
import { mapGetters, mapActions } from 'vuex'

let firstTime = true

export default {
  data () {
    return {
      isShowInstruction: this.$route.name === 'instructions'
    }
  },
  created () {
    ipcRenderer.on('open-file-response', (event, path) => {
      if (isExcelFile(path)) {
        this.initAfterImportFile({
          path,
          type: 'node'
        })
        this.setUploadFiles(path)
      } else {
        ipcRenderer.send('sync-alert-dialog', {
          content: '不支持该文件格式'
        })
      }
    })
    if (!this.isKeepCurVersion && firstTime) {
      this.checkUpdate(false)
      firstTime = false
    }
  },
  computed: {
    hasFile () {
      return this.curOriRowCount > 0
    },
    filterAcount () {
      const activeSheetName = this.activeSheetName
      const curUniqueCols = this.uniqueCols[activeSheetName] || []
      const curUniqueLength = curUniqueCols.length
      return curUniqueLength > 0
        ? this.curFilterTagListCount + 1
        : this.curFilterTagListCount
    },
    ...mapGetters({
      isShowFilterPanel: 'getFilterPanelStatus',
      isShowSideBar: 'getSideBarStatus',
      filterWay: 'getFilterWay',
      curOriRowCount: 'getCurOriRowCount',
      curFilRowCount: 'getCurFilRowCount',
      curFilterTagListCount: 'getCurFilterTagListCount',
      isKeepCurVersion: 'getKeepCurVersion',
      isShowUpdateDialog: 'getUpdateDialogStatus',
      uniqueCols: 'getUniqueCols',
      activeSheetName: 'getActiveSheetName'
    })
  },
  methods: {
    openExternal,
    toggleView () {
      const curRouteName = this.$route.name
      if (curRouteName === 'instructions') {
        this.$router.push('index')
      } else {
        this.$router.push('instructions')
      }
    },
    focusSearchInput () {
      const searchInput = document.getElementById('search_file_input')
      this.toggleSideBar()
      if (this.isShowSideBar) {
        this.$nextTick(() => {
          searchInput && searchInput.focus()
        })
      }
    },
    handleFile (e) {
      ipcRenderer.send('sync-openFile-dialog')
    },
    checkForUpdate () {
      this.checkUpdate(true)
      this.setKeepVersionStatus(false)
    },
    checkUpdate (isClick) {
      const that = this
      console.log(appInfo.updateUrl)
      request({
        url: appInfo.updateUrl,
        method: 'GET'
      }, function (err, response, body) {
        if (err) {
          console.log(err)
        }
        try {
          const statusCode = response.statusCode
          if (statusCode === 200) {
            const res = JSON.parse(response.body)
            /**
            *  1即小于，表示当前版本比服务器上的版本还要新
            *  0即等于，表示已是最新版
            *  -1即大于，表示有更新版本
            */
            const compareResult = compareVersions(appInfo.app_version, res.name)
            console.log('compareResult', compareResult)
            console.log('appInfo.app_version', appInfo.app_version)
            console.log('res.name', res.name)
            if (compareResult === -1) {
              // 由于 github 对于国内用户下载速度太慢，所以要切换至国内
              let downloadUrl = getDownloadUrl(res.name)
              console.log(downloadUrl)
              if (typeof downloadUrl === 'undefined') {
                downloadUrl = res.url
              }
              that.toggleUpdateDialog(true)
              that.setUpdateUrl(downloadUrl)
              that.setUpdateVersion(res.name)
              that.setUpdateLog(res.notes)
              that.setUpdatePubDate(res.pub_date)
              that.setHasNewStatus(true)
            }
          } else if (statusCode === 204) {
            console.log('无新版本')
            if (isClick) {
              that.toggleUpdateDialog(true)
            }
            that.setHasNewStatus(false)
          }
        } catch (e) {
          console.log('version 解析失败')
          console.log(e)
        }
      })
    },
    clickFilterBtn () {
      this.toggleFilterPanelStatus()
    },
    ...mapActions([
      'toggleSideBar',
      'toggleFilterPanelStatus',
      'initAfterImportFile',
      'setUploadFiles',
      'toggleUpdateDialog',
      'setUpdateUrl',
      'setUpdateVersion',
      'setUpdateLog',
      'setUpdatePubDate',
      'setHasNewStatus',
      'setKeepVersionStatus'
    ])
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

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 56px;
  background-color: #262626;
  position: relative;
  z-index: 120;
  >div {
    flex-wrap: nowrap;
    white-space: nowrap;
  }
  .btn_group {
    font-size: 0;
    display: flex; // justify-content: space-between;
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
    &+img {
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
  .upload_btn {
    overflow: hidden;
  }
}
</style>
