<template>
  <div class="window_top_container" @dblclick="maximizeHandler">
    <ul>
      <li class="minimize" @click.prevent.stop="minimizeHandler"></li>
      <li class="maximize" @click.prevent.stop="maximizeHandler"></li>
      <li class="close" @click.prevent.stop="closeHandler"></li>
    </ul>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { mapActions } from 'vuex'

export default {
  methods: {
    minimizeHandler () {
      this.toggleWindowMin()
    },
    maximizeHandler () {
      this.toggleWindowMax()
    },
    closeHandler () {
      ipcRenderer.send('sync-close')
    },
    ...mapActions([
      'toggleWindowMax',
      'toggleWindowMin'
    ])
  }
}
</script>

<style lang="scss" scoped>
.window_top_container {
  -webkit-user-select: none;
  user-select: none;
  height: 32px;
  background-color: #2B3244;
  display: flex;
  justify-content: flex-end;
  transition: background-color .5s;
  &:active {
    background-color: #000;
  }
  >ul {
    display: flex;
    color: #fff;
    -webkit-app-region: no-drag;
    li {
      width: 32px;
      line-height: 32px;
      text-align: center;
      background-position: 50% 50%;
      background-repeat: no-repeat;
      transition: background-color .3s;
      &.minimize {
        background-image: url(../assets/svg/window_top_min.svg);
        background-position: 50% 20px;
      }
      &.maximize {
        background-image: url(../assets/svg/window_top_full_screen.svg);
      }
      &.close {
        background-image: url(../assets/svg/window_top_close.svg);
      }

      &:hover {
        background-color: #555;
      }
    }
  }
}
</style>
