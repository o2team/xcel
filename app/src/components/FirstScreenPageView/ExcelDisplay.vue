<!-- Excel -->
<template>
	<div class="excel_area">
		<div class="tabs is_boxed is_small excel_cheet_nav"
			v-show="sheetNameList.length !== 0">
			<ul>
				<li v-for = "(sheetName, index) in sheetNameList"
          :key="index"
					:class="{'is_active': index == activeSheet.index}"
					@click = "changeTab(index)">
					<a href="javascript:;">
						<span>{{ sheetName }}</span>
					</a>
				</li>
			</ul>
		</div>
		<div class="tabs_body">
			<div class="drop_area content"
				v-show="sheetNameList.length < 1"
				@drop.prevent.stop="dropHandler"
				@dragenter="dragenterHandler"
				@dragleave="dragleaveHandler"
				>
				<p class = "drop_tips">
					<img src="../assets/svg/excel_display_warm.svg" alt="[警告]">当前没有选中任何Excel文件，可将文件拖拽至此区域。
				</p>
			</div>
			<sheet-of-excel v-for="(sheetName, index) in sheetNameList"
        :key="index"
				v-show="activeSheet.index === index"
				:sheetHTML="sheetHTML">
			</sheet-of-excel>
		</div>
	</div>
</template>


<script>
import { ipcRenderer } from 'electron'
import { isExcelFile } from '../../utils/ExcelSet'
import { mapGetters, mapActions } from 'vuex'
import SheetOfExcel from './SheetOfExcel'

export default {
  components: {
    SheetOfExcel
  },
  data () {
    return {
      sheetHTML: ''
    }
  },
  mounted () {
    ipcRenderer.on('generate-htmlstring-response', (event, { sheetHTML }) => {
      this.sheetHTML = sheetHTML
    })

    const dropArea = document.querySelector('.drop_area')
    if (dropArea) {
      dropArea.addEventListener('dragenter', dragoverHandler, false)
      dropArea.addEventListener('dragover', dragoverHandler, false)
    }
    function dragoverHandler (e) {
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    }
  },
  computed: {
    ...mapGetters({
      activeSheet: 'getActiveSheet',
      filterTagList: 'getFilterTagList',
      filterWay: 'getFilterWay',
      sheetNameList: 'getSheetNameList',
      uniqueCols: 'getUniqueCols'
    })
  },
  methods: {
    changeTab (index) {
      this.setActiveSheet(index)
      ipcRenderer.send('changeTab-start', {
        filterTagList: this.filterTagList,
        filterWay: this.filterWay,
        activeSheetName: this.activeSheet.name,
        uniqueCols: this.uniqueCols
      })
    },
    dragenterHandler (e) {
      e.target.classList.add('active')
    },
    dragleaveHandler (e) {
      e.target.classList.remove('active')
    },
    dropHandler (e) {
      const files = e.dataTransfer.files
      const path = files[0].path

      if (!isExcelFile(path)) {
        this.dragleaveHandler(e)
        ipcRenderer.send('sync-alert-dialog', {
          content: '不支持该文件格式'
        })
      } else {
        this.initAfterImportFile({
          path,
          type: 'node'
        })
        this.setUploadFiles(path)
      }
    },
    ...mapActions([
      'setActiveSheet',
      'initAfterImportFile',
      'setUploadFiles'
    ])
  }
}

</script>

<style lang="scss" scoped>
.excel_area {
  display: flex;
  flex-direction: column;
  max-width: 100%;
  width: 100%;
  margin-top: 5px;
  padding: 5px;
  flex-grow: 1;
}

.tabs {
  flex-shrink: 0;
  flex-grow: 0;
}

.tabs_body {
  flex-grow: 1;
  flex-shrink: 1;
  overflow: auto;
  position: relative;
  display: block;
  overflow: auto;
  &>* {
    display: block;
    width: 100%;
    height: 100%;
  }
  &>p {
    display: inline-block;
    &.is_loading {
      padding-right: 24px;
    }
  }
}

.excel_cheet_nav {
  margin-bottom: 5px;
  ul {
    padding-left: 5px;
  }
}

.drop_area {
  // opacity: 0;
  font-size: 18px;
  position: relative;
  vertical-align: middle;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  transition: background-color .25s ease-out;
  &.active {
    background-color: #2B3244;
  }
  .drop_tips {
    display: inline-block;
    font-size: 12px;
    color: #fff;
    padding: 9px 6px 9px 11px;
    line-height: 17px;
    background-color: rgba(0, 0, 0, .15);
    text-align: center;
    pointer-events: none;
    img {
      vertical-align: text-top;
      margin: 1px 6px 0 0;
    }
  }
  p {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
