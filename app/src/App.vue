

<template>
  <div>
    <window-top style="-webkit-app-region: drag;"></window-top>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <update-dialog></update-dialog>
  </div>
</template>

<script>
  
  import windowTop from './components/common/WindowTop'
  import crashTempate from '../crashTempate'
  import UpdateDialog from './components/common/UpdateDialog'
  import { getColSelectDialogStatus, getUpdateDialogStatus, getSideBarStatus } from './vuex/getters'
  import { setColSelectDialogStatus, toggleUpdateDialog, toggleSideBar } from './vuex/actions'

  // crashTempate.start()
  export default {
    components: {
      windowTop,
      UpdateDialog
    },
    vuex: {
      getters: {
        isShowColSelectDialog: getColSelectDialogStatus,
        isShowUpdateDialog: getUpdateDialogStatus,
        isShowSideBar: getSideBarStatus
      },
      actions: {
        setColSelectDialogStatus,
        toggleUpdateDialog,
        toggleSideBar
      }
    },
    mounted() {
      document.body.addEventListener('keyup', this.keyupHandler , false)
    },
    methods: {
      keyupHandler(event) {
        let keyCode = event.keyCode
        if(keyCode === 27) {
          if(this.isShowUpdateDialog) {
            this.toggleUpdateDialog(false)
            return
          }
          if(this.isShowColSelectDialog) {
            this.setColSelectDialogStatus(false)
            return
          }
          if(this.isShowSideBar) {
            this.toggleSideBar(false)
            return
          }
        } 
      }
    }
  }
</script>

<style lang="scss">
  @import './components/common/assets/common.scss';
  @import './components/common/assets/content.scss';
  @import './components/common/assets/table.scss';
  @import './components/common/assets/tabs.scss';
  @import './components/common/assets/select.scss';
  @import './components/common/assets/markdown.scss';
</style>