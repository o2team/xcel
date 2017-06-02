<template>
	<div class="sheet_of_excel"
		:class="{'isShowSideBar': !sideBarStatus}">
		<table class="table is_bordered">
			<thead>
				<tr>
					<th></th>
					<!-- v-for 整数迭代是从1开始 -->
					<th v-for="col in curColCount" :title="'即第' + col + '行'">
						{{ getCharCol(col - 1) }}
					</th>
				</tr>
			</thead>
			<tbody></tbody>
		</table>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCharCol, getNumCol } from '../../utils/ExcelSet'

export default {
  props: {
    sheetHTML: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      sideBarStatus: 'getSideBarStatus',
      curOriRowCount: 'getCurOriRowCount',
      curColCount: 'getCurColCount'
    })
  },
  mounted () {
    const tbody = this.$el.querySelector('tbody')
    tbody && (tbody.innerHTML = this.sheetHTML)
    console.log('curColCount', this.curColCount)
  },
  watch: {
    sheetHTML () {
      const tbody = this.$el.querySelector('tbody')
      tbody && (tbody.innerHTML = this.sheetHTML)
    }
  },
  methods: {
    getCharCol,
    getNumCol
  }
}

</script>

<style lang="scss" scoped>
table {
  /* table不卡起决定性作用 */
  transform: translate3d(0, 0, 0);
  margin-bottom: 0;
}

.first-col {
  background-color: #eee
}

table thead tr th,
table thead th:hover,
table tbody tr td:first-child,
table tbody tr td:first-child:hover {
  background-color: #eee;
}
</style>
<style lang="scss">
/* 由于td是自己后续加的，没有添加vue属性，放在 scoped里面则不会匹配这些样式 */

.excel_area tbody tr:first-child td {
  white-space: nowrap;
}

table {
  overflow: hidden
}

tbody td {
  position: relative;
  &:hover {
    &::after {
      content: "\20";
      position: absolute;
      height: 10000px;
      width: 100%;
      left: 0;
      top: -5000px;
      background-color: #f5f7fa;
      z-index: -1;
    }
  }
}

.sheet_of_excel thead>tr:first-child>th {
  &:first-child {
    position: relative;
    background-image: linear-gradient(to top right, transparent, transparent calc(50% - 0.5px), #d3d6db calc(50% - 0.5px), #d3d6db calc(50% + 0.5px), transparent calc(50% + 0.5px));
    &::before {
      content: "列";
      width: 50%;
      text-align: center;
      position: absolute;
      right: 0;
      top: 3px;
    }
    &::after {
      content: "行";
      width: 50%;
      position: absolute;
      text-align: center;
      left: 0;
      bottom: 3px;
    }
  }
}
</style>
