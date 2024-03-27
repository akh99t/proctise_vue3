<template>
  <div class="chart_box" v-if="['chart'].includes(type)">
    <div class="chart_content" :id="id"></div>
  </div>
  <div class="chart_box" v-if="['table'].includes(type)">
    <el-table
      :data="tableData"
      :border="true"
      height="100%"
      show-overflow-tooltip
    >
      <el-table-column type="index" :index="indexMethodFn" width="100" />
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
import { ref, onMounted, toRaw } from "vue";
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
let tableData = ref([]);
let indexMethod = ref([]);

// 初始化数据
const initData = (data: object = {}) => {
  let cloneDeepChartOptions = Object.assign(cloneDeep(chartOptions), data);
  if (["chart"].includes(props.type)) {
    // console.log('--- chart 初始化数据 ---', cloneDeepChartOptions);
    Highcharts.chart(id, cloneDeepChartOptions);
  }
  if (["table"].includes(props.type)) {
    let { series, xAxis } = cloneDeepChartOptions;
    columnList.value.length = 0;
    tableData.value.length = 0;
    indexMethod.value.length = 0;
    let categories: [] = series.map((item: any, index: number) => {
      return item?.title || `数据${index + 1}`;
    });
    columnList.value.push(...categories);

    let indexMethodArr: [] = xAxis?.categories || [];
    indexMethod.value.push(...indexMethodArr);
    indexMethod.value.forEach((item: any, index: number) => {
      let obj: {
        [key: string]: number | string;
      } = {};
      series.forEach((i: any, ind: number) => {
        obj[categories[ind]] = i.data[index];
      });
      tableData.value.push(obj);
    });
  }
};

// 判断是否为非数字类型
let decideIsNaNFn = (value: any) => {
  return isNaN(value) || typeof value !== "number" ? "--" : value;
};

// 表格的索引
let indexMethodFn = (index: number) => {
  return toRaw(indexMethod.value)[index];
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
  border-radius: 10px;
  overflow: hidden;
  .chart_content {
    // width: 100%;
    height: 100%;
  }
}
</style>
