<template>
	<transition name="slide-fade">
		<div id="sidebar" v-show="getSideBarStatus">
			<div class="sidebar_header">
				<img src="../assets/xcel_logo.png"
					class="logo"
					title="XCEL官网"
					@click="openExternal('xcel')">
				<p>Ultimate EXCEL Filter</p>
				<a class="hide_sidebar_btn"
					title="关闭侧边栏"
					@click="toggleSideBar(false)">
				</a>
			</div>
			<div>
				<file-list></file-list>
			</div>
			<div class="search_form">
				<input type="text"
					id="search_file_input"
					placeholder="请输入搜索关键字"
					v-model="vuexSearchVal">
			</div>
		</div>
	</transition>
</template>

<script>
import { openExternal } from '../../utils/openExternal'
import FileList from './FileList'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    FileList
  },
  computed: {
    vuexSearchVal: {
      get () {
        return this.getSearchVal
      },
      set (val) {
        this.setSearchVal(val)
      }
    },
    ...mapGetters([
      'getSideBarStatus',
      'getSearchVal'
    ])
  },
  methods: {
    openExternal,
    ...mapActions([
      'toggleSideBar',
      'setSearchVal'
    ])
  }
}
</script>

<style lang="scss" scoped>
#sidebar {
  transform: translateZ(0);
  background-color: #FAFAFA;
  width: 269px;
  position: fixed;
  left: 0;
  top: 32px;
  bottom: 56px;
  z-index: 100;
  box-shadow: 0 0 16px rgba(0, 0, 0, .18), 0 16px 16px rgba(0, 0, 0, .24);
}

.sidebar_header {
  background-color: #616161;
  padding-left: 24px;
  overflow: hidden;
  img {
    width: 56px;
    margin-top: 24px;
    &+p {
      font-size: 13px;
      color: #fff;
      line-height: 20px;
      margin: 28px 0 16px 0;
    }
  }
  .hide_sidebar_btn {
    position: absolute;
    width: 24px;
    height: 24px;
    top: 6px;
    right: 6px;
    text-align: center;
    line-height: 1;
    cursor: pointer;
    padding: 5px;
    -webkit-app-region: no-drag;
    transition: transform .2s;
    background: url('../assets/svg/sidebar_close.svg') 50% 50% no-repeat;

    &:hover {
      transform: rotate(90deg)
    }
  }
}

.search_form {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 34px;
  input {
    display: block;
    width: 100%;
    height: 100%;
  }
}

.logo {
  cursor: pointer;
}

.slide-fade-enter-active {
  animation: slide-fade-in .3s;
}

.slide-fade-leave-active {
  animation: slide-fade-out .3s;
}

@keyframes slide-fade-in {
  0% {
    transform: translate3d(-100%, 0, 0);
    opacity: 0;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: translateX(0, 0, 0);
  }
}

@keyframes slide-fade-out {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(-100%);
    opacity: 0;
  }
}
</style>
