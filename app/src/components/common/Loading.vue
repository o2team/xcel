<template>
  <div class="loading_mask" :class="{show : fileStatus !== -1}">
    <div class="loading">
      <div class="loading_inner">
        <p>
          <i class="fa fa-spinner" aria-hidden="true"></i>
        </p>
        <p>{{ loadingText[fileStatus] }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      loadingText: [
        '文件正在导入中',
        '文件正在过滤中',
        '文件正在导出中'
      ]
    }
  },
  computed: {
    ...mapGetters({
      fileStatus: 'getFileStatus'
    })
  }
}
</script>

<style lang="scss" scoped>
.loading_mask {
  background-color: transparent;
  position: fixed;
  top: 32px;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  display: none;
  &.show {
    display: block
  }
  .loading {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    &_inner {
      text-align: center;
      background-color: rgba(0, 0, 0, .8);
      color: #fff;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 110px;
      height: 110px;
      padding: 5px;
    }
    p:first-child {
      margin-bottom: 8px;
      .fa {
        font-size: 26px;
        color: #fff;
        animation: rotate 1s infinite;
      }
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg)
  }
  100% {
    transform: rotate(360deg)
  }
}
</style>
