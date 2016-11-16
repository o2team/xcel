

<template>
  <div>
    <window-top style="-webkit-app-region: drag;"></window-top>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import windowTop from './components/common/WindowTop'

  export default {
    components: {
      windowTop
    }
  }
</script>


<style lang="scss">
  @import './components/common/assets/common.scss';
  @import './components/common/assets/content.scss';
  @import './components/common/assets/table.scss';
  @import './components/common/assets/tabs.scss';
  @import './components/common/assets/select.scss';
</style>