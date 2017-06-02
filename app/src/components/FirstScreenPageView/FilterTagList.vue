<template>
	<div class="filter_list">
		<div class="filter_tag_palceholder" v-show="isShowPlaceholder">
			<img src="../assets/svg/filter_tag_list_warm.svg" alt="[警告]">暂无任何筛选条件.
		</div>
		<unique-tag
			:unique-cols="uniqueCols[activeSheetName]"
			:cur-filter-tag-list="filterTagList[activeSheetName]"
			v-if="uniqueCols[activeSheetName] && uniqueCols[activeSheetName].length > 0">
		</unique-tag>
		<filter-tag v-for="(filterTag, index) in filterTagList[activeSheetName]"
      :key="index"
			:filter-tag="filterTag"
			:tag-index="index">
		</filter-tag>
	</div>
</template>

<script>
import FilterTag from './FilterTag'
import UniqueTag from './UniqueTag'
import { mapGetters } from 'vuex'

export default {
  components: {
    FilterTag,
    UniqueTag
  },
  data () {
    return {
      curFilterTagList: []
    }
  },
  computed: {
    isShowPlaceholder () {
      const activeSheetName = this.activeSheetName
      const curTagList = this.filterTagList[activeSheetName]
      const curUniqueCols = this.uniqueCols[activeSheetName]

      if (!curTagList || curTagList.length === 0) {
        if (typeof curUniqueCols === 'undefined') return true
        if (curUniqueCols.length === 0) {
          return true
        }
        return false
      }
      return false
    },
    ...mapGetters({
      filterTagList: 'getFilterTagList',
      activeSheetName: 'getActiveSheetName',
      uniqueCols: 'getUniqueCols'
    })
  }
}
</script>

<style lang="scss">
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
		img {
			vertical-align: sub;
			margin-right: 5px;
		}
	}

	.filter_tag{
		display: flex;
		flex-wrap: nowrap;
		background-color: #9B9B9B;
		color: #D8D8D8;
		margin:0 10px 5px 0;
		font-size: 12px;
		&>*{
			line-height: 24px;
			text-align: center;
		}
		p{
			min-width: 100px;
			padding: 0 5px;
		}
		.logic_char, .unique_char {
			background-color: #6B727D;
			color: #fff;
		}
		.unique_char {
			width: 40px;
		}
		.logic_char{
			width: 22px;
		}
		.group_id{
			width: 22px;
			height: 24px;
			background-color: #2B3244;
			color: #fff;
		}
		.close_btn{
			width: 22px;
			height: 24px;
			padding: 0;
			color: #fff;
			background-color: #FF4081;
			border: 0;
			outline: 0;
			cursor: pointer;
		}
		ul, li {
			display: flex;
		}
	}
</style>
