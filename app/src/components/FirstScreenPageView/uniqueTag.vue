<template>
  <span class="unique_tag filter_tag">
    <span class="unique_char">去重</span>
    <p>{{ uniqueWords }}</p>
    <button class="close_btn" @click="delHandler()">
      <img src="../assets/svg/filter_tag_del.svg" alt="删除">
    </button>
  </span>
</template>

<script>
import { getCharCol } from '../../utils/ExcelSet'
import { mapActions } from 'vuex'

export default {
  props: {
    uniqueCols: {
      type: Array,
      required: true
    },
    curFilterTagList: {
      type: Array,
      required: true
    }
  },
  computed: {
    uniqueWords () {
      let finalWords = '第'
      this.uniqueCols.forEach((item, index) => {
        if (index === this.uniqueCols.length - 1) {
          finalWords += `${this.getCharCol(item)}列`
        } else {
          finalWords += `${this.getCharCol(item)},`
        }
      })
      return finalWords
    }
  },
  methods: {
    getCharCol,
    delHandler () {
      this.setUniqueCols([])
      this.checkFilterAndUnqiueCount()
    },
    ...mapActions([
      'setUniqueCols',
      'checkFilterAndUnqiueCount'
    ])
  }
}
</script>
