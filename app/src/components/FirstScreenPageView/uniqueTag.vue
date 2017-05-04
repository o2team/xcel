<template>
    <span class="unique_tag filter_tag">
        <span class="unique_char">去重</span>
        <p>{{ uniqueWords }}</p>
        <button class="close_btn" @click="delHandler()">
            <svg width="10px" height="10px" viewBox="6 7 10 10" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <desc>x</desc>
                <defs></defs>
                <g id="Material/Icons-black/close" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" transform="translate(6.000000, 7.000000)">
                    <polygon id="Shape" fill="#FFFFFF" points="10 1 9 0 5 4 1 0 0 1 4 5 0 9 1 10 5 6 9 10 10 9 6 5"></polygon>
                </g>
            </svg>
        </button>
    </span>
</template>

<script>
    import { getCharCol } from '../../utils/ExcelSet'
    import { mapGetters, mapActions } from 'vuex'

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
            uniqueWords() {
                let finalWords = '第'
                this.uniqueCols.forEach((item, index) => {
                    if (index === this.uniqueCols.length - 1) {
                        finalWords += `${this.getCharCol(item)}列`
                    } else {
                        finalWords += `${this.getCharCol(item)},`
                    }
                })
                return finalWords
            },
            ...mapGetters({
                activeSheet: 'getActiveSheet'
            })
        },
        methods: {
            getCharCol,
            delHandler() {
                console.log('this.curFilterTagList', this.curFilterTagList)
                this.setUniqueCols({
                    activeSheetName: this.activeSheet.name,
                    cols: [],
                    curFilterTagList: this.curFilterTagList
                })
            },
            ...mapActions([
                'setUniqueCols'
            ])

        }
    }
</script>