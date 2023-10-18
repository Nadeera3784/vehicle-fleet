<template>
  <div class="box">
    <div class="container" :style="{ width: `${ChartWidth}%` }">
      <GanttChart
        :gantt-data="GanttData"
        :gantt-current-time="GanttCurrentTime"
        :first-line-stick="firstLineStick"
        :time-section="GanttTime"
        :chart-max-height="ChartHeight"
        :float-view-render-fn="floatRender"
        @rightClick.native="handleRightClick"
      >
        <template #side-box="{ item }">
          <SideComponent :side-info="item" />
        </template>
        <template #container-box="{ item }">
          <ContentComponent :content-info="item" />
        </template>
      </GanttChart>
    </div>
  </div>
</template>
<script>
import dayjs from "dayjs";
import SideComponent from "./components/SideComponent";
import ContentComponent from "./components/ContentComponent";
import { mockData } from "./lib/mock";
export default {
  components: { ContentComponent, SideComponent },
  data() {
    return {
      GanttTime: [
        dayjs().format("YYYY/MM/DD"),
        dayjs().add(3, "day").format("YYYY/MM/DD"),
      ],
      GanttData: mockData(50),
      GanttCurrentTime: new Date().getTime(),
      floatRender: (info) =>
        `<div>${info.startAirport}</div><div>${info.workType}</div><div>${info.endAirport}</div>`,
      marker: null,
      firstLineStick: true,
      ChartWidth: 80,
      ChartHeight: 600,
    };
  },

  beforeDestroy() {
    clearInterval(this.marker);
  },
  methods: {
    handleRightClick(event) {
      console.log("event", event);
      const info = event.detail;
      this.$notify.info({
        title: "Event",
        dangerouslyUseHTMLString: true,
        message: `
                <div>
                <strong>Start</strong>:  ${info.startAirport}
                </div>
                <div>
                <strong>Type</strong>:  ${info.workType}</div>
                <div>
                <strong>End</strong>:  ${info.endAirport}
                </div>`,
      });
    },
  },
};
</script>
