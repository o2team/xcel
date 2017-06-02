<template>
  <div class="filter_panel" v-show="filterPanelStatus">
    <div class="filter_tag_container">
      <filter-tag-list class="filter_tag_list"></filter-tag-list>
      <button class="submit_btn btn" title="点击筛选并导出文件" @click="filterHandler">
        <img src="../assets/svg/filter_panel_submit.svg" alt="确定" title="开始过滤">
      </button>
    </div>
    <div class="filter_form_group">
      <div class="filter_form_group_inside">
        <filter-form-single-logic></filter-form-single-logic>
        <filter-form-multi-calc></filter-form-multi-calc>
        <filter-form-double-cols-range></filter-form-double-cols-range>
        <filter-form-unique></filter-form-unique>
      </div>
    </div>
  </div>
</template>

<script>
import FilterTagList from './FilterTagList'
import FilterFormSingleLogic from './FilterFormSingleLogic'
import FilterFormMultiCalc from './FilterFormMultiCalc'
import FilterFormDoubleColsRange from './FilterFormDoubleColsRange'
import FilterFormUnique from './FilterFormUnique'
import { mapGetters, mapActions } from 'vuex'
import { ipcRenderer } from 'electron'

export default {
  components: {
    FilterTagList,
    FilterFormSingleLogic,
    FilterFormMultiCalc,
    FilterFormDoubleColsRange,
    FilterFormUnique
  },
  data () {
    return {
      curCol: 1,
      filterVal: '',
      colOfSheet: 1,
      filterFormNav: ['单列（组合）逻辑', '多列运算逻辑', '双列范围逻辑'],
      activeFilterFormIndex: 0
    }
  },
  created () {
    ipcRenderer.on('filter-response', (event, { filRow }) => {
      this.setFileStatus(2)
      this.setFilteredData(filRow)
      ipcRenderer.send('exportFile-start')
    })

    ipcRenderer.on('exportFile-response', (event, { info, type }) => {
      console.log(info)
      this.setFileStatus(-1)

      if (type === -1) {
        setTimeout(() => {
          ipcRenderer.send('sync-alert-dialog', {
            content: info
          })
        }, 30)
      }
    })
  },
  computed: {
    ...mapGetters({
      filterPanelStatus: 'getFilterPanelStatus',
      filterTagList: 'getFilterTagList',
      filterWay: 'getFilterWay',
      fileStatus: 'getFileStatus',
      curFilterTagListCount: 'getCurFilterTagListCount',
      uniqueCols: 'getUniqueCols',
      curUniqueColsCount: 'getCurUniqueColsCount',
      sheetNameList: 'getSheetNameList',
      activeSheetName: 'getActiveSheetName'
    })
  },
  methods: {
    filterHandler () {
      if (this.sheetNameList.length === 0) {
        ipcRenderer.send('sync-alert-dialog', {
          content: '请先上传Excel文件'
        })
      } else if (this.curFilterTagListCount === 0 && this.curUniqueColsCount === 0) {
        ipcRenderer.send('sync-alert-dialog', {
          content: '请先添加筛选条件'
        })
      } else {
        this.setFileStatus(1)
        ipcRenderer.send('filter-start', {
          filterTagList: this.filterTagList,
          filterWay: this.filterWay,
          activeSheetName: this.activeSheetName,
          uniqueCols: this.uniqueCols
        })
      }
    },
    ...mapActions([
      'setFilteredData',
      'setFileStatus'
    ])
  }
}
</script>

<style lang="scss">
.filter_tag_container {
  min-height: 64px;
  background-color: #fff;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, .2);
  padding: 20px 27px 15px;
  position: relative;
}

.filter_tag_list {
  margin-right: 64px;
  &+button {
    width: 64px;
    height: 64px;
    position: absolute;
    right: 0;
    bottom: 0;
    background-color: #4285F4;
    color: #fff;
    border: 0;
    outline: 0;
    padding: 3px 6px;
    cursor: pointer;
  }
}

.filter_form_group {
  background-color: #2B3244;
  padding: 22px 20px;
  overflow: auto;
  &_inside {
    min-width: 1080px;
    background-color: #fff;
  }
  .table {
    margin-bottom: 0;
    width: 100%;
  }
  form {
    position: relative;
    &:not(:last-child)::after {
      content: "\20";
      position: absolute;
      bottom: 0px;
      width: 100%;
      border-bottom: 1px solid rgba(0, 0, 0, .1)
    }
  }
}

.filter_form_group table tr {
  display: flex; // justify-content: space-between;
  align-items: center;
  height: 54px;
}

.filter_form_group table tr td {
  color: #000;
  font-size: 12px;
  color: #2B3244;
  flex-grow: 0;
  .val_mask {
    color: #2B3244;
  }
  &:first-child {
    width: 130px;
    text-align: center;
  }
  &:nth-child(2) {
    width: 82px;
  }
  &:nth-child(3) {
    width: 127px;
    p {
      width: 107px;
      line-height: 24px;
      border: 1px solid #D8D8D8;
      text-align: center;
      cursor: pointer;
    }
  }
  &:nth-child(4) {
    width: 127px;
    .select {
      width: 107px;
    }
  }
  &:nth-child(5) {
    width: 127px;
    .select {
      width: 107px;
    }
  }
  &:nth-child(6) {
    width: 317px;
    input {
      width: 300px;
      line-height: 24px;
    }
  }
  &:last-child {
    flex-grow: 1;
    button {
      background-color: #4285F4;
      font-size: 12px;
      text-align: center;
      line-height: 24px;
      border-radius: 13px;
      color: #fff;
      width: 66px;
      padding: 0;
      border: 0;
      outline: 0;
      cursor: pointer;
    }
  }
}

.table tr td {
  vertical-align: middle;
}

input[type="text"] {
  font-size: 12px;
  text-align: center;
  outline: 0;
  border: 1px solid #D8D8D8;
  outline: none;
  padding: 0;
  &:disabled {
    cursor: not-allowed;
    background-color: #eee;
  }
}
</style>

