<template>
  <div class="chart_box" v-if="['chart'].includes(type)">
    <div class="chart_content" :id="id"></div>
  </div>
  <div class="chart_box" v-if="['table'].includes(type)">
    <el-table :data="tableData" :border="true">
      <el-table-column
        v-for="item in columnList"
        :prop="item"
        :label="item"
        min-width="80"
      >
        <template #default="scope">
          {{ decideIsNaNFn(scope.row[item]) }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import mitt from "@/plugins/mitt";
import { nanoid } from "nanoid";
import { ref, onMounted } from "vue";
import { chartOptions } from "@/views/configureChair/components/ts/chartData";

import Highcharts from "highcharts/highstock";
// import HighchartsMore from 'highcharts/highcharts-more';
// import HighchartsDrilldown from 'highcharts/modules/drilldown';
// import Highcharts3D from 'highcharts/highcharts-3d';
import Highmaps from "highcharts/modules/map";
import { cloneDeep } from "lodash";
// HighchartsMore(Highcharts)
// HighchartsDrilldown(Highcharts);
// Highcharts3D(Highcharts);
Highmaps(Highcharts);
const props = defineProps(["type"]);

let id: any = nanoid() || "nanoid999";
let columnList = ref([]);
let tableData = ref([])

// 初始化数据
const initData = (data: object = {}) => {
  let cloneDeepChartOptions = Object.assign(cloneDeep(chartOptions), data);
  if (["chart"].includes(props.type)) {
    // console.log('--- chart 初始化数据 ---', cloneDeepChartOptions);
    Highcharts.chart(id, cloneDeepChartOptions);
  }
  if (["table"].includes(props.type)) {
    let { xAxis, series } = cloneDeepChartOptions;
    columnList.value.length = 0;
    tableData.value.length = 0;
    let categories: [] = xAxis?.categories;
    columnList.value.push(...categories);
    let data = series
    series.forEach((item:{data:any[]}) => {
      let obj:{
        [key:string]: any
      } = {}
      item.data.forEach((i, index) => {
        obj[columnList.value[index]] = i
      });
      tableData.value.push(obj)
    });
    tableData.value
    console.log(
      "--- chart 初始化数据 ---",
      cloneDeepChartOptions,
      columnList.value,
      props.type
    );
  }
};

// 判断是否为非数字类型
let decideIsNaNFn = (value: any) => {
  return isNaN(value) || typeof value !== "number" ? "--" : value;
};

// onMounted(() => {
//   initData();
// });

defineExpose({ initData });
</script>

<style scoped lang="less">
.chart_box {
  // width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  .chart_content {
    // width: 100%;
    height: 100%;
  }
}
</style>
