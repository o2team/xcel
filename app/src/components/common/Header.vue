<template>
	<header>
		<nav>
			<div class="toggle_sidebar_btn" 
				:title="isShowInstruction ? '返回' : '打开/关闭侧边栏'" 
				@click="clickHandler">
		    <i class="fa" 
		    	:class="isShowInstruction ? 'fa-chevron-left' : 'fa-bars'"></i>
			</div>
			<div class="filter_way_container" 
		  	v-show="!isShowInstruction">
				筛选方式：
				<label title="符合条件则保留">
					<input type="radio" value="0" v-model="vuexFilterWay">保留
				</label>
				<label title="符合条件则剔除">
					<input type="radio" value="1" v-model="vuexFilterWay">剔除
				</label>
			</div>
		</nav>
	</header>
</template>

<script> 
	import { toggleSideBar, setFilterWay } from '../../vuex/actions'
	import { getFilterWay } from '../../vuex/getters'
	import WindowTop from './WindowTop'
	import os from 'os'

	export default {
		components :{
			WindowTop
		},
		data() {
			return {
				isShowNav: false,
				isShowInstruction: this.$route.name === 'instructions',
				osStr: os.platform()
			}
		},
		vuex: {
			getters: {
				filterWay: getFilterWay
			},
			actions: {
				toggleSideBar,
				setFilterWay
			}
		},
		computed: {
			vuexFilterWay: {
				get() {
					return this.filterWay
				},
				set(val) {
					this.setFilterWay(val)
				}
			},
		},
		methods: {
			clickHandler() {
				if(this.isShowInstruction) {
					this.$router.push('index')
				}else {
					this.toggleSideBar()
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	header{
		color: #000;
		nav{
			box-shadow: 0 0 4px rgba(0, 0, 0, .12), 0 4px 4px rgba(0, 0, 0, .24);
			height: 64px;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
		.fa{
			font-size: 18px;
			color: rgba(0, 0, 0, .54);
			transition: color .3s;
		}
		.toggle_sidebar_btn{
			padding: 0 24px;
			cursor: pointer;
			line-height: 64px;
			&:hover .fa{
				color: #262626;
			}
		}
		.filter_way_container{
			font-size: 14px;
			margin-right: 20px;
			label {
				cursor: pointer;
			}
			label:not(:last-child){
				margin-right: 5px;
			}
			input[type="radio"] {
				display: inline-block;
				margin-right: 4px;
				vertical-align: middle;
				.darwin & {
					vertical-align: 1px;
				}
			}
		}
	}
</style>