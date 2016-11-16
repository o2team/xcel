<template>
	<div class="window_top_container" @dblclick="maximizeHandler">
		<ul>
			<li class="minimize" @click.prevent.stop="minimizeHandler">
				<svg width="14px" height="2px" viewBox="18 20 14 2" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
				    <desc>最小化icon</desc>
				    <defs></defs>
				    <polygon id="minimise" stroke="none" fill-opacity="0.899999976" fill="#FFFFFF" fill-rule="evenodd" points="18 20 31.94 20 31.94 22 18 22"></polygon>
				</svg>
			</li>
			<li class="maximize" @click.prevent.stop="maximizeHandler">
				<svg width="15px" height="12px" viewBox="50 10 15 12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
				    <desc>最大化icon</desc>
				    <defs></defs>
				    <path d="M52,11.999 L62,11.999 L62,20 L52,20 L52,11.999 Z M50,22 L64.001,22 L64.001,10 L50,10 L50,22 Z" id="maximise" stroke="none" fill-opacity="0.899999976" fill="#FFFFFF" fill-rule="evenodd"></path>
				</svg>
			</li>
			<li class="close" @click.prevent.stop="closeHandler">
				<svg width="12px" height="12px" viewBox="83 10 12 12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
				    <desc>关闭icon</desc>
				    <defs></defs>
				    <polygon id="close" stroke="none" fill-opacity="0.899999976" fill="#FFFFFF" fill-rule="evenodd" points="89 14.586 84.414 10 83 11.414 87.586 16 83 20.586 84.414 22 89 17.414 93.586 22 95 20.586 90.414 16 95 11.414 93.586 10"></polygon>
				</svg>
			</li>
		</ul>
	</div>
</template>

<script>
	import { ipcRenderer } from 'electron'
	import { toggleWindowMax, toggleWindowMini } from '../../vuex/actions'
	export default {
		vuex: {
			actions: {
				toggleWindowMax,
				toggleWindowMini
			}
		},
		methods: {
			minimizeHandler(){
		    this.toggleWindowMini()
			},
			maximizeHandler(){
				this.toggleWindowMax()
			},
			closeHandler(){
		    ipcRenderer.send('sync-close')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.window_top_container{
		-webkit-user-select: none;
		user-select: none;
		height: 32px;
		background-color: #2B3244;
		display: flex;
		justify-content: flex-end;
		transition: background-color .5s;
		&:active {
			background-color: #000;
		}
		>ul {
			display: flex;
			color: #fff;
			-webkit-app-region: no-drag;
			li {
				width: 32px;
				line-height: 32px;
				text-align: center;
				&:hover {
					background-color: #555;
				}
			}
		}
	}
</style>