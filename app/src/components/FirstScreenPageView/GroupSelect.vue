<template>
	<span class="select">
		<select v-model="childGroupId" >
			<option value="-1">组别</option>
			<!-- v-for 整数迭代是从1开始 -->
			<option
				v-for="index in groupNum" :value="index - 1">
				{{ getGroupValue(index - 1) }}
			</option>
		</select>
		<p class="val_mask">{{ getGroupName(childGroupId) }}</p>
	</span>
</template>

<script>
import { getCharCol } from '../../utils/ExcelSet'
export default {
  data () {
    return {
      groupNum: 5,
      childGroupId: this.groupId
    }
  },
  props: {
    groupId: {
      default: -1,
      required: true,
      type: [Number, String]
    }
  },
  watch: {
    groupId () {
      this.childGroupId = this.groupId
    },
    childGroupId () {
      this.$emit('changeSelect', this.childGroupId)
    }
  },
  methods: {
    getCharCol,
    getGroupValue (index) {
      return this.getCharCol(index)
    },
    getGroupName (groupId) {
      return groupId.toString() === '-1' ? '组别' : this.getCharCol(groupId)
    }
  }
}
</script>
