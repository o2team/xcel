<template>
	<span class="select">
		<select v-model="childGroupId" >
			<option value="-1">组别</option>
			<option v-for="index in groupNum" :value="index">{{ getGroupValue(index) }}</option>
		</select>
		<p class="val_mask">{{ getGroupName(childGroupId) }}</p>
	</span>
</template>

<script>
	import { getCharCol } from "../../utils/ExcelSet"
	export default {
		data() {
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
			groupId() {
				this.childGroupId = this.groupId
			},
			childGroupId() {
				this.$emit('changeSelect', this.childGroupId)
			}
		},
		methods: {
			getCharCol,
			getGroupValue(index) {
				return this.getCharCol(index)
			},
			getGroupName(groupId) {
				return groupId == '-1' ? '组别' : this.getCharCol(groupId)
			}
		}
	}
</script>

<style lang="scss">
	
</style>