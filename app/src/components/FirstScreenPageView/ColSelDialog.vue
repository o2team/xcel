<template>
	<div class="col_sel_modal" :class="{'active': colSelectDialogStatus}">
		<div class="col_sel_dialog">
			<div class="col_sel_dialog_header">
				<div>
					<img src="../assets/svg/col_select_dialog_i.svg" alt="[!]">
					<h4>请选择列</h4>
				</div>
				<div class="selected_col_container">
					<p>{{ selectedGroupStr }}</p>
					<button type="button"
						class="invert_selection_btn"
						title="点击该按钮进行反选"
						v-show="curColCount > 0 && colSelectType === 3"
						@click="invertSelectionHandler">
						{{ btnText }}
					</button>
				</div>
			</div>
			<div class="col_sel_dialog_content">
				<p class="no_content_tips"
					v-if="curColCount === 0">
					请先上传Excel文件或该文件未含有列
				</p>
				<ul v-else>
					<li v-for="(item, index) in curColKeys"
						@click="toggleSelect(index)"
						:class="{'active': selectedGroup.includes(index)}">
						<div>
							<span>{{ getCharCol(index) }}</span>
							<p>{{ item }}</p>
						</div>
					</li>
				</ul>
			</div>
			<div class="col_sel_dialog_footer">
				<div v-if="curColCount === 0">
					<button type="button" @click="closeDialog" style="font-size: 16px">确定</button>
				</div>
				<div v-else>
					<button type="button" @click="closeDialog">
						<img src="../assets/svg/col_select_dialog_close.svg" alt="关闭">
					</button>
					<button type="button" @click="submit">
						<img src="../assets/svg/col_select_dialog_confirm.svg" alt="确认">
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { getCharCol } from '../../utils/ExcelSet'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      selectedGroup: []
    }
  },
  computed: {
    selectedGroupStr () {
      return this.selectedGroup.map((item, index) =>
        this.getCharCol(item)
      ).join('、')
    },
    btnText () {
      const selectedGroupLength = this.selectedGroup.length
      if (selectedGroupLength === 0) return '全选'
      else if (selectedGroupLength === this.curColCount) return '全不选'
      return '反选'
    },
    ...mapGetters({
      curColKeys: 'getCurColKeys',
      colSelectDialogStatus: 'getColSelectDialogStatus',
      colSelectType: 'getColSelectType',
      curColCount: 'getCurColCount'
    })
  },
  methods: {
    getCharCol,
    closeDialog () {
      this.selectedGroup = []
      this.setColSelectDialogStatus(false)
    },
    submit () {
      let warmStr = ''
      const colSelectType = this.colSelectType
      const colSelectGroup = this.selectedGroup
      const colSelectLen = colSelectGroup.length
      const eventBus = window.eventBus
      if (this.curColCount === 0) {
        ipcRenderer.send('sync-alert-dialog', {
          content: 'Excel文件未上传或未含有列'
        })
        return
      }
      if (colSelectType === 0) {
        if (colSelectLen === 0) {
          warmStr = '单列运算逻辑需要选择一列'
        } else {
          eventBus.$emit('colSelVal4Single', colSelectGroup)
        }
      } else if (colSelectType === 1) {
        if (colSelectLen < 2) {
          warmStr = '多列运算逻辑至少选择两列'
        } else {
          eventBus.$emit('colSelVal4Multi', colSelectGroup)
        }
      } else if (colSelectType === 2) {
        if (colSelectLen !== 2) {
          warmStr = '双列运算逻辑只能选择两列'
        } else {
          eventBus.$emit('colSelVal4Double', colSelectGroup)
        }
      } else if (colSelectType === 3) {
        if (colSelectLen === 0) {
          warmStr = '多列去重逻辑至少选择一列'
        } else {
          eventBus.$emit('colSelVal4Remove', colSelectGroup)
        }
      }

      if (warmStr.length === 0) {
        this.selectedGroup = []
        this.setColSelectDialogStatus(false)
      } else {
        ipcRenderer.send('sync-alert-dialog', {
          content: warmStr
        })
      }
    },
    toggleSelect (index) {
      const selectedGroup = this.selectedGroup
      const colSelectType = this.colSelectType

      if (colSelectType === 0) {
        selectedGroup.splice(0, 1, index)
      } else if (colSelectType === 1 || colSelectType === 3) {
        if (selectedGroup.includes(index)) {
          const i = selectedGroup.indexOf(index)
          selectedGroup.splice(i, 1)
        } else {
          selectedGroup.push(index)
        }
      } else if (colSelectType === 2) {
        if (selectedGroup.length < 3) {
          if (selectedGroup.includes(index)) {
            const i = selectedGroup.indexOf(index)
            selectedGroup.splice(i, 1)
          } else if (selectedGroup.length < 2) {
            selectedGroup.push(index)
          }
        }
      }
    },
    invertSelectionHandler () {
      const selectedGroup = this.selectedGroup
      const tempSelectedGroup = []

      if (selectedGroup.length === 0) {
        for (let i = 0; i < this.curColCount; i++) {
          this.selectedGroup.push(i)
        }
      } else {
        for (let i = 0; i < this.curColCount; i++) {
          if (selectedGroup.indexOf(i) === -1) {
            tempSelectedGroup.push(i)
          }
        }
        this.selectedGroup = tempSelectedGroup
      }
    },
    ...mapActions([
      'setColSelectDialogStatus'
    ])
  }
}
</script>


<style lang="scss" scoped>
	.col_sel_modal {
		position: fixed;
		top: 32px;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(0,0,0, .5);
		overflow: hidden;
		z-index: 100;
		visibility: hidden;
		transition: all .3s;
		&.active {
			visibility: visible;
		}
	}
	.selected_col_container {
		color: #fff;
		display: flex;
		align-items: center;

		.invert_selection_btn {
			margin-left: 15px;
			background-color: #4285F4;
			color: #fff;
			line-height: 26px;
			width: 66px;
			border: 0;
			padding: 0;
			border-radius: 13px;
			outline: 0;
			cursor: pointer;
		}
	}
	.col_sel_dialog {
		position: absolute;
		left: 50%;
		transform: translate(-50%, -80%);
		width: 800px;
		height: 320px;
		background-color: #fff;
		box-shadow: 0 2px 4px rgba(0,0,0,.5);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		transition: all .3s;
		opacity: 0;
		.col_sel_modal.active & {
			transform: translate(-50%, 0);
			opacity: 1;
		}
		&_header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			flex-grow: 0;
			flex-shrink: 0;
			height: 60px;
			padding: 0 20px;
			background-color: #262626;
			>div:first-child {
				white-space: nowrap;
				margin-right: 20px;
			}
			h4, img {
				vertical-align: middle;
			}
			h4 {
				display: inline-block;
				font-size: 24px;
				color: #fff;
			}
		}
		&_content {
			max-height: 210px;
			overflow: auto;
			flex-grow: 1;
			flex-shrink: 0;
			padding: 15px 20px;
			position: relative;
			.no_content_tips {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
			}
			ul {
				display: flex;
				flex-wrap: wrap;
			}
			li {
				font-size: 0;
				margin: 0 15px 15px 0;
				text-align: center;
				cursor: pointer;
				&.active {
					span {
						color: #fff;
						background-color: #5CB85C;
					}
				}
				span, p {
					display: inline-block;
					height: 24px;
					line-height:24px;
					font-size: 12px;
					vertical-align: middle;
				}
				span {
					min-width: 22px;
					color: #C8CCCF;
					background-color: #2B3244;
				}
				p {
					min-width: 122px;
					color: #D8D8D8;
					background-color: #9B9B9B;
					padding: 0 6px;
				}
			}
		}
		&_footer {
			flex-grow: 0;
			flex-shrink: 0;
			>div {
				display: flex;
				align-items: stretch;
				height: 50px;
			}
			button {
				flex-grow: 1;
				-webkit-appearance: normal;
				outline: none;
				border: 0;
				background-color: #D8D8D8;
				cursor: pointer;
				&:last-child {
					background-color: #4285F4;
					color: #fff;
				}
			}
		}
	}
</style>
