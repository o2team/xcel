<template>
    <form class="unique_form" @submit.prevent="addUniqueHandler" @keyup.stop>
        <table class="table">
            <tbody>
                <tr>
                    <td>多列去重逻辑</td>
                    <td>
						<span class="select disabled">
							<select v-model="logicOperator" disabled>
								<option value="and">且</option>
							</select>
							<p class="val_mask">{{ getLogicOperatorWords(logicOperator)}}</p>
						</span>
					</td>
                    <td>
                        <p class="col_placeholder" @click="showColSelectDialog">
                            {{operatorCol.length === 0 ? "请选择列" : formatColGroup}}
                        </p>
                    </td>

                    <td>
                        <button type="submit">添加</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </form>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {
  getCharCol,
  getLogicOperatorWords
} from '../../utils/ExcelSet'
import { ipcRenderer } from 'electron'

export default {
  data () {
    return {
      operatorCol: [],
      logicOperator: 'and'
    }
  },
  mounted () {
    window.eventBus.$on('colSelVal4Remove', colSelectGroup => {
      console.log('收到')
      this.operatorCol = colSelectGroup
    })
  },
  computed: {
    formatColGroup () {
      console.log(this.operatorCol)
      return this.operatorCol.map((col, index) =>
        this.getCharCol(col)
      ).join(',')
    },
    ...mapGetters({
      curColCount: 'getCurColCount',
      filterTagList: 'getFilterTagList',
      curFilterTagListCount: 'getCurFilterTagListCount',
      uniqueCols: 'getUniqueCols'
    })
  },
  methods: {
    getCharCol,
    getLogicOperatorWords,
    showColSelectDialog () {
      this.setColSelectType(3)
      this.setColSelectDialogStatus(true)
    },
    addUniqueHandler () {
      if (!this.validateForm()) {
        return
      }
      const uniqueCols = this.operatorCol.map((col, index) =>
        col - 1
      )
      this.setUniqueCols(uniqueCols)
      this.operatorCol = []
    },
    validateForm () {
      if (this.uniqueCols.length > 0) {
        ipcRenderer.send('sync-alert-dialog', {
          content: '筛选条件已存在去重逻辑。若需替换，请先删除原有去重逻辑。'
        })
        return false
      }

      if (this.operatorCol.length > 0) return true

      ipcRenderer.send('sync-alert-dialog', {
        content: '多列去重逻辑：至少填写一列'
      })
      return false
    },
    ...mapActions([
      'setColSelectDialogStatus',
      'setColSelectType',
      'addFilter',
      'setUniqueCols'
    ])
  }
}

</script>


<style lang="scss" soped>
.unique_form {
  tr {
    td {
      &:nth-child(3) {
        width: 780px!important;
        .col_placeholder {
          width: 100%;
          text-align: left;
          padding-left: 28px;
        }
      }
      &:last-child {
        width: auto!important;
        justify-content: flex-end;
      }
    }
  }
  .select {
    &.disabled {
      select {
        cursor: not-allowed;
      }
      .val_mask {
        color: rgb(84, 84, 84);
        background-color: #eee;
      }
      &::after {
        border-top-color: rgb(84, 84, 94)
      }
    }
  }
}
</style>
