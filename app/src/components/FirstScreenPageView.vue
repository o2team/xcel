<template>
	<div class="first_screen" :class="osStr">
		<v-header class="header"></v-header>
		<main :class="{isShowSideBar: sideBarStatus}">
			<excel-display></excel-display>
		</main>
		<v-footer class="footer"></v-footer>
		<filter-panel id="filter-panel"></filter-panel>
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
	import { getSideBarStatus } from '../vuex/getters'
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
		data(){
			return {
				osStr: os.platform()
			}
		},
		vuex: {
			getters: {
				sideBarStatus: getSideBarStatus
			}
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
	main{
		position: relative;
		overflow: hidden;
		flex-grow: 1;
		flex-shrink: 1;
		display: flex;
	}
	.header, .footer{
		flex-grow: 0;
		flex-shrink: 0;
	}
</style>