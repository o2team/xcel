<template>
  <span class="filter_tag">
    <span class="logic_char">
      {{ getLogicOperator(filterTag.filters[0].logicOperator) }}
    </span>
    <span class="group_id" v-if="filterTag.groupId != '-1'">
      {{ getCharCol(filterTag.groupId) }}
    </span>
    <ul>
      <li v-for="(filter, index) in filterTag.filters">
        <span class="logic_char" v-if="index !== 0">
          {{ getLogicOperator(filter.logicOperator) }}
        </span>
        <p>{{ filter.filterWords }}</p>
      </li>
    </ul>
    <button class="close_btn" @click="delHandler(tagIndex)">
      <img src="../assets/svg/filter_tag_del.svg" alt="关闭">
    </button>
  </span>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { getCharCol } from '../../utils/ExcelSet'

export default {
  props: {
    filterTag: {
      type: Object,
      required: true
    },
    tagIndex: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      uniqueCols: 'getUniqueCols',
      activeSheetName: 'getActiveSheetName'
    })
  },
  methods: {
    getCharCol,
    delHandler (index) {
      const activeSheetName = this.activeSheetName
      const curUniqueCols = this.uniqueCols[activeSheetName]

      this.delFilter({
        index,
        curUniqueCols
      })

      this.checkFilterAndUnqiueCount()
    },
    getLogicOperator (char) {
      return char === 'and' ? '且' : '或'
    },
    ...mapActions([
      'delFilter',
      'setFilteredData',
      'checkFilterAndUnqiueCount'
    ])
  }
}
</script>
