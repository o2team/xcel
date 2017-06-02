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
// import crashTempate from '../crashTempate'
import UpdateDialog from './components/common/UpdateDialog'
import { mapGetters, mapActions } from 'vuex'

// crashTempate.start()
export default {
  components: {
    windowTop,
    UpdateDialog
  },
  mounted () {
    document.body.addEventListener('keyup', this.keyupHandler, false)
  },
  computed: {
    ...mapGetters({
      isShowColSelectDialog: 'getColSelectDialogStatus',
      isShowUpdateDialog: 'getUpdateDialogStatus',
      isShowSideBar: 'getSideBarStatus'
    })
  },
  methods: {
    keyupHandler (event) {
      const keyCode = event.keyCode
      if (keyCode === 27) {
        if (this.isShowUpdateDialog) {
          this.toggleUpdateDialog(false)
          return
        }
        if (this.isShowColSelectDialog) {
          this.setColSelectDialogStatus(false)
          return
        }
        if (this.isShowSideBar) {
          this.toggleSideBar(false)
        }
      }
    },
    ...mapActions([
      'setColSelectDialogStatus',
      'toggleUpdateDialog',
      'toggleSideBar'
    ])
  }
}
</script>

<style lang="scss">
@import './components/assets/common.scss';
@import './components/assets/content.scss';
@import './components/assets/table.scss';
@import './components/assets/tabs.scss';
@import './components/assets/select.scss';
@import './components/assets/markdown.scss';
</style>
