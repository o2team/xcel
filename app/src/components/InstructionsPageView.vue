<template>
  <div class="instructions_view">
    <v-header class="header"></v-header>
    <main>
      <instructions-area></instructions-area>
    </main>
    <v-footer class="footer"></v-footer>
  </div>
</template>

<script>
import vHeader from './common/Header'
import Footer from './common/Footer'
import InstructionsArea from './InstructionsPageView/Instructions'
export default {
  name: 'instructions',
  components: {
    vHeader,
    InstructionsArea,
    vFooter: Footer
  }
}
</script>

<style lang="scss" scoped>
.instructions_view {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 32px);
  justify-content: space-between;
}

main {
  // padding: 15px;
  flex-grow: 0;
  flex-shrink: 1;
  overflow: auto;
}

.header,
.footer {
  flex-shrink: 0;
  flex-grow: 0;
}
</style>
<style>
.content {
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
  overflow: visible!important;
}
</style>
