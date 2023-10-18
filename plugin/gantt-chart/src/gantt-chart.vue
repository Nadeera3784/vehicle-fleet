<template>
  <div class="gantt__layout" @contextmenu.prevent>
    <chart-header
      v-show="showHeader"
      :header-data="headerData"
    />
    <template v-if="ganttData.length">
      <div
        class="gantt__area"
        :style="areaStyleObj"
        @handleFloatView="handleFloatView"
      >
        <chart-side
          v-slot="{item}"
          :gantt-data="chartData"
          :first-line-stick="firstLineStick"
        >
          <slot name="side-box" :item="item" />
        </chart-side>
        <chart-container
          id="gantt-container"
          v-slot="{item}"
          :spend-time="spendTime"
          :gantt-data="chartData"
          :first-line-stick="firstLineStick"
        >
          <slot name="container-box" :item="item" />
        </chart-container>
      </div>
    </template>
    <template v-else>
      <div class="gantt__area--error">Error</div>
    </template>
  </div>
</template>

<script>
import ChartHeader from './components/chart-header'
import ChartContainer from './components/chart-container'
import ChartSide from './components/chart-side'
import FloatView from './lib/FloatView'
import Drag from './unit/drag'
import isBetween from 'dayjs/plugin/isBetween'
import dayjs from 'dayjs'
dayjs.extend(isBetween)
export default {
  name: 'GanttChart',
  components: { ChartHeader, ChartSide, ChartContainer },
  provide () {
    return {
      timeSectionDayJs: this.timeSectionDayJs,
      baseHour: this.baseHour,
      baseBlock: this.baseBlock
    }
  },
  props: {
    showHeader: { 
      type: Boolean,
      default: true
    },
    headerData: { 
      type: Array,
      default: () => ['X', 'Y']
    },
    timeSection: { 
      type: Array,
      required: true
    },
    firstLineStick: {
      type: Boolean,
      default: true
    },
    chartMaxHeight: { 
      type: Number,
      default: 500
    },
    ganttCurrentTime: {
      type: Number,
      default: new Date().getTime()
    },
    ganttData: { 
      type: Array,
      required: true
    },
    floatViewRenderFn: { 
      type: Function,
      default: () => { return (info) => info }
    }
  },
  data () {
    return {
      baseHour: 50, 
      baseBlock: 40, 
      floatState: true
    }
  },
  computed: {
    areaStyleObj () { 
      const realHeight = this.ganttData.length * this.baseBlock
      return { height: `${realHeight > this.chartMaxHeight ? this.chartMaxHeight : realHeight}px` }
    },
    timeSectionDayJs () { 
      const [start, end] = this.timeSection.map(item => dayjs(item))
      if (start.isValid() && end.isValid()) {
        return { start, end }
      } else {
        console.log(`timeSection${this.timeSection}`)
        return {}
      }
    },
    spendTime () { 
      let time
      if (dayjs(this.ganttCurrentTime).isBetween(this.timeSectionDayJs.start, this.timeSectionDayJs.end, null, '[]')) {
        time = dayjs(dayjs(this.ganttCurrentTime)).diff(this.timeSectionDayJs.start, 'second')
      } else {
        console.error('time error')
        time = 0
      }
      return time
    },
    chartData () {
      return this.ganttData.map(item => {
        item.childArray = item.childArray.filter(task => dayjs(task.end).isBefore(this.timeSectionDayJs.end.add(1, 'day')))
        return item
      })
    }
  },
  mounted () { 
    const header = document.querySelector('.gantt__layout .header__container')
    const side = document.querySelector('.gantt__layout .side')
    const container = document.querySelector('.gantt__layout .container')
    const area = document.querySelector('.gantt__layout')
    let flag = ''
    area.addEventListener('mouseenter', (event) => {
      const className = event.target.className
      if (className.includes('container')) flag = 'container'
      if (className.includes('side')) flag = 'side'
    }, true)
    area.addEventListener('scroll', (event) => {
      if (flag === 'container' && event.target.className === 'container') {
        side.scrollTop = event.target.scrollTop
        header.scrollLeft = event.target.scrollLeft
      }
      if (flag === 'side') container.scrollTop = event.target.scrollTop
    }, true)
    // float
    area.addEventListener('mousemove', (event) => {
      this.floatState = event.buttons === 0
    })
    new Drag(container)
  },
  methods: {
    handleFloatView (event) {
      if (this.floatState) {
        const triggerEvent = event.target
        const { info } = event.detail
        const layerEvent = document.getElementById('gantt-container')
        const htmlTmpl = this.floatViewRenderFn(info)
        FloatView({ layerEvent, triggerEvent, htmlTmpl })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.gantt__layout{
  margin: 0;
  padding: 0;
  overflow: hidden;
}
.gantt__area{
  display: grid;
  grid-template-columns: 250px 1fr;
}
.gantt__area--error{
  font-size: 3em;
  text-align: center;
}
</style>
