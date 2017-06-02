<template>
  <div class="update_modal" @keyup :class="{'active': updateDialogStatus}">
    <div class="update_dialog" :class="isHasNewVersion ? 'has_new' : 'no_new'">
      <template v-if="isHasNewVersion">
        <div class="update_dialog_header">
          <h4>新版本『v{{ updateVersion }}』的更新内容如下：</h4>
        </div>
        <div class="update_dialog_content">
          <div class="update_content markdown-body">
            <div class="markdown_html_content" v-html="updateNotesHTML"></div>
            <p class="update_pub_date">更新日期：{{ formatPubDate }}</p>
          </div>
        </div>
        <div class="update_dialog_footer">
          <div>
            <button type="button" class="one_day_btn" @click="keepCurVersion">暂用当前版本</button>
            <button type="button" class="update_btn" @click="updateBtnHandler">升级</button>
            <button type="button" class="close_btn" @click="closeDialog">取消</button>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="update_dialog_header">
          <h4>XCel 已是最新版本</h4>
        </div>
        <div class="update_dialog_content">
          <p>如遇软件使用上的问题，请联系
            <a @click="openExternal('aotu')">凹凸实验室
            </a>。同时，也欢迎你提出宝贵的意见。
          </p>
          <p>问题提交地址：
            <a @click="openExternal('issues')">问题/建议提交地址。
            </a>
          </p>
          <div>
            <img src="../InstructionsPageView/assets/qrcode.jpg" alt="凹凸实验室二维码">
          </div>
        </div>
        <div class="update_dialog_footer">
          <div>
            <button type="button" class="close_btn" @click="closeDialog">关闭</button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { ipcRenderer } from 'electron'
import { openExternal } from '../../utils/openExternal'
import { markdown } from 'markdown'

const moment = require('moment')
moment.locale('zh')

export default {
  data () {
    return {}
  },
  computed: {
    updateNotesHTML () {
      return markdown.toHTML(this.updateNotes) || '空'
    },
    formatPubDate () {
      return (moment(this.updatePubDate)
        .subtract(8, 'hours')
        .format('YYYY年MM月DD日 HH时mm分'))
    },
    ...mapGetters({
      updateDialogStatus: 'getUpdateDialogStatus',
      updateUrl: 'getUpdateUrl',
      updateVersion: 'getUpdateVersion',
      updateNotes: 'getUpdateLog',
      updatePubDate: 'getUpdatePubDate',
      isHasNewVersion: 'getHasNewVersionStatus'
    })
  },
  methods: {
    openExternal,
    closeDialog () {
      this.toggleUpdateDialog(false)
    },
    updateBtnHandler () {
      ipcRenderer.send('will-download-handler', {
        url: this.updateUrl
      })
      this.toggleUpdateDialog(false)
    },
    keepCurVersion () {
      this.toggleUpdateDialog(false)
      this.setKeepVersionStatus(true)
    },
    ...mapActions([
      'toggleUpdateDialog',
      'setKeepVersionStatus'
    ])
  }
}
</script>

<style scoped lang="scss">
.update_modal {
  position: fixed;
  top: 32px;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, .5);
  overflow: hidden;
  z-index: 102;
  visibility: hidden;
  transition: all .3s;
  &.active {
    visibility: visible;
  }
}

.update_dialog {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -80%);
  width: 500px;
  height: 400px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .5);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all .3s;
  opacity: 0;
  &.no_new {
    height: 400px;
  }
  .update_modal.active & {
    transform: translate(-50%, 0);
    opacity: 1;
  }
  &_header {
    flex-grow: 0;
    flex-shrink: 0;
    height: 60px;
    padding: 0 20px;
    background-color: #262626;
    h4 {
      display: inline-block;
      font-size: 16px;
      color: #fff;
      line-height: 60px;
    }
  }
  &_content {
    .has_new & {
      display: flex;
    }
    .no_new & {
      padding: 15px 20px;
      p {
        margin-bottom: 10px;
      }
    }

    overflow: auto;
    flex-grow: 1;
    flex-shrink: 1;
    padding: 0 20px;
    position: relative;
  }
  &_footer {
    flex-grow: 0;
    flex-shrink: 0;
    >div {
      display: flex;
      align-item: stretch;
      height: 50px;
    }
    button {
      flex-basis: 30%;
      flex-grow: 1;
      flex-shrink: 0;
      -webkit-appearance: normal;
      appearance: normal;
      font-size: 14px;
      outline: none;
      border: 0;
      background-color: #D8D8D8;
      cursor: pointer;
      &.update_btn {
        background-color: #4285F4;
        color: #fff;
      }
    }
  }
}
</style>
