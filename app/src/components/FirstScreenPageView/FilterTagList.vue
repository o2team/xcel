<template>
	<div class="filter_list">
		<div class="filter_tag_palceholder" v-show="isShowPlaceHolder">
			<svg width="18px" height="15px" viewBox="0 1 18 15" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
			    <!-- Generator: Sketch 40.2 (33826) - http://www.bohemiancoding.com/sketch -->
			    <desc>Created with Sketch.</desc>
			    <defs></defs>
			    <path d="M0.5,16 L17.5,16 L9,1 L0.5,16 L0.5,16 Z M10,14 L8,14 L8,12 L10,12 L10,14 L10,14 Z M10,11 L8,11 L8,7 L10,7 L10,11 L10,11 Z" id="Shape" stroke="none" fill="#D50000" fill-rule="evenodd"></path>
			</svg>暂无任何筛选条件.
		</div>
		<filter-tag v-for="(filterTag, index) in filterTagList[activeSheet.name]" 
			:filter-tag="filterTag" 
			:tag-index="index">
		</filter-tag>
	</div>
</template>

<script>
	import FilterTag from './FilterTag'
	import { getFilterTagList, getActiveSheet } from '../../vuex/getters'

	export default {
		components: {
			FilterTag
		},
		data(){
			return {
				curFilterTagList: []
			}
		},
		vuex: {
			getters: {
				filterTagList: getFilterTagList,
				activeSheet: getActiveSheet
			}
		},
		computed: {
			isShowPlaceHolder() {
				let curTagList = this.filterTagList[this.activeSheet.name]
				if(!curTagList || curTagList.length === 0) {
					return true
				}else {
					return false
				}
			}
		}
		
	}
</script>

<style lang="scss" scoped>
	.filter_list{
		display: flex;
		flex-wrap: wrap;
	}
	.filter_tag_palceholder {
		background-color: #2B3244;
		color: #fff;
		font-size: 12px;
		line-height: 24px;
		padding: 0 13px 0 7px;
		// width: 160px;
		svg {
			vertical-align: sub;
			margin-right: 5px;
		}
	}
</style>