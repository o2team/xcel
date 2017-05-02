<template>
	<div id="sidebar" v-show="getSideBarStatus">
		<div class="sidebar_header">
			<img src="./assets/xcel_logo.png">
			<p>Ultimate EXCEL Filter</p>
			<a href="javascript:;" class="hide_sidebar_btn" @click="toggleSideBar(false)">
				<svg width="14px" height="14px" viewBox="5 5 14 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
				    <desc>x</desc>
				    <defs></defs>
				    <polygon id="Shape" stroke="none" fill="#fff" fill-rule="evenodd" points="19 6.4 17.6 5 12 10.6 6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12"></polygon>
				</svg>
			</a>
		</div>
		<div>
			<file-list></file-list>
		</div>
		<div class="search_form">
			<input type="text" id="search_file_input"
				placeholder="请输入搜索关键字" 
				v-model="vuexSearchVal">
		</div>
	</div>
</template>

<script>
	import FileList from './FileList'
	import { getSideBarStatus, getCurSearchVal } from '../../vuex/getters'
	import { toggleSideBar, changeSearchVal } from '../../vuex/actions'

	export default {
		components: {
			FileList
		},
		computed: {
			vuexSearchVal: {
				get() {
					return this.getCurSearchVal
				},
				set(val) {
					this.changeSearchVal(val)
				}
			}
		},
		vuex: {
			getters: {
				getSideBarStatus,
				getCurSearchVal
			},
			actions: {
				toggleSideBar,
				changeSearchVal
			}
		}
	}
</script>

<style lang="scss" scoped>
	#sidebar{
		transform: translateZ(0);
		background-color: #FAFAFA;
		width: 269px;
		position: fixed;
		left: 0;
		top: 0;
		bottom: 56px;
		z-index: 100;
		box-shadow: 0 0 16px rgba(0, 0, 0, .18), 0 16px 16px rgba(0, 0, 0, .24);
	}
	.sidebar_header{
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
		.hide_sidebar_btn{
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
		}
	}

	.search_form{
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
</style>