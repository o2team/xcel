<template>
  <div class="first_screen" :class="osStr">
    <v-header class="header"></v-header>
    <main :class="{isShowSideBar: sideBarStatus}">
      <excel-display></excel-display>
      <filter-panel id="filter-panel"></filter-panel>
    </main>
    <v-footer class="footer"></v-footer>
    <side-bar class="sibebar"></side-bar>
    <col-sel-dialog></col-sel-dialog>
    <loading></loading>
  </div>
</template>

<script>
import SideBar from './common/SideBar'
import Footer from './common/Footer'
import vHeader from './common/Header'
import Loading from './common/Loading'
import ExcelDisplay from './FirstScreenPageView/ExcelDisplay'
import FilterPanel from './FirstScreenPageView/FilterPanel'
import ColSelDialog from './FirstScreenPageView/ColSelDialog'
import { mapGetters } from 'vuex'
import os from 'os'

console.log('主页面pid：', process.pid)

export default {
  name: 'index',
  components: {
    vHeader,
    SideBar,
    vFooter: Footer,
    ExcelDisplay,
    FilterPanel,
    Loading,
    ColSelDialog
  },
  data () {
    return {
      osStr: os.platform()
    }
  },
  computed: {
    ...mapGetters({
      sideBarStatus: 'getSideBarStatus'
    })
  }
}
</script>

<style scoped>
.first_screen {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 32px);
  justify-content: space-between;
}

main {
  position: relative;
  overflow: hidden;
  flex-grow: 1;
  flex-shrink: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between
}

.header,
.footer {
  flex-grow: 0;
  flex-shrink: 0;
}
</style>
