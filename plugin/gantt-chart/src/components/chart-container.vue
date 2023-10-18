<template>
  <div class="container">
    <div :style="blockStyle">
      <template v-for="(block,index) in ganttData">
        <chart-block
          :key="index"
          v-slot="{item}"
          :spend-time="spendTime"
          :class="{sticky:firstLineStick&&index===0}"
          :style="blockSelected(index)"
          :block="block"
          @click.native="handleHighlight(index)"
        >
          <slot :item="item" />
        </chart-block>
      </template>
    </div>
  </div>
</template>

<script>
import ChartBlock from './chart-block'
import { handleDaySet } from '../unit/GanttUnit'
export default {
  name: 'ChartContainer',
  components: {ChartBlock },
  inject: ['baseHour', 'timeSectionDayJs'],
  props: {
    ganttData: {
      type: Array,
      default: () => []
    },
    spendTime: {
      type: Number,
      required: true
    },
    firstLineStick: { 
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      activeIndex: -1,
      dragEvent: {
        dragStart: null,
        dragEnd: null
      }
    }
  },
  computed: {
    blockStyle () {
      const { start, end } = this.timeSectionDayJs
      return { width: `${this.baseHour * handleDaySet(start, end).length * 24}px` }
    }
  },
  methods: {
    handleHighlight (index) {
      this.activeIndex = index
    },
    blockSelected (index) {
      return index === this.activeIndex ? { backgroundColor: `rgba(0,0,0,0.1)` } : {}
    }
  }
}
</script>

<style scoped lang="scss">
.container{
  position: relative;
  overflow: overlay;
  &::-webkit-scrollbar-thumb:horizontal { 
    width: 4px;
    background-color: #CCCCCC;
    -webkit-border-radius: 6px;
  }
  &::-webkit-scrollbar-track-piece {
    background-color: #fff;
    -webkit-border-radius: 0; 
  }
  &::-webkit-scrollbar {
    width: 10px; 
    height: 8px; 
  }
  &::-webkit-scrollbar-thumb:vertical { 
    height: 50px;
    background-color: #999;
    -webkit-border-radius: 4px;
    outline: 2px solid #fff;
    outline-offset: -2px;
    border: 2px solid #fff;
  }
  &::-webkit-scrollbar-thumb:hover { 
    height: 50px;
    background-color: #9f9f9f;
    -webkit-border-radius: 4px;
  }
}
.sticky{
  position: sticky;
  top: 0;
  z-index: 105;
  background-color: white;
}
</style>
