import GanttChart from './src/gantt-chart.vue'

GanttChart.install = function (Vue) {
  Vue.component(GanttChart.name, GanttChart)
}
export default GanttChart

