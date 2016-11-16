<template>
	<span class="tag">
		<span class="logic_char">{{ getLogicOperator(filterTag.filters[0].logicOperator) }}</span>
		<span class="group_id" v-if="filterTag.groupId != '-1'">
			{{ getCharCol(filterTag.groupId) }}
		</span>
		<ul>
			<li v-for="(filter, index) in filterTag.filters">
				<span class="logic_char" v-if="index !== 0">{{ getLogicOperator(filter.logicOperator) }}</span>
				<p>{{ filter.filterWords }}</p>
			</li>
		</ul>
		<button class="close_btn" @click="delHandler(tagIndex)">
			<svg width="10px" height="10px" viewBox="6 7 10 10" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
			    <desc>Created with Sketch.</desc>
			    <defs></defs>
			    <g id="Material/Icons-black/close" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" transform="translate(6.000000, 7.000000)">
			        <polygon id="Shape" fill="#FFFFFF" points="10 1 9 0 5 4 1 0 0 1 4 5 0 9 1 10 5 6 9 10 10 9 6 5"></polygon>
			    </g>
			</svg>
		</button>
	</span>
</template>

<script>
	import { delFilter } from '../../vuex/actions'
	import { getCharCol } from "../../utils/ExcelSet"

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
		vuex: {
			actions: {
				delFilter
			}
		},
		methods: {
			getCharCol,
			delHandler(index){
				this.delFilter(index)
			},
			getLogicOperator(char) {
				return char === 'and' ? '且' : '或'
			},
			getFilterWords(filterTag) {
				let finalWords = ''
				filterTag.filters.forEach((item, index) => {
					finalWords
				})
			}
		}
	}
</script>


<style lang="scss" scoped>
	.tag{
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
	}
	p{
		min-width: 100px;
		padding: 0 5px;
	}
	.logic_char{
		width: 22px;
		background-color: #6B727D;
		color: #fff;
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
</style>