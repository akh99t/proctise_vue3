<template>
  <div class="main">
    <configurationItem v-for="{ key, title } in chartConfiguration" :key="key">
      <template v-slot:title>
        {{ title }}
      </template>

      <template v-slot:content>
        <div class="chart_type" v-if="key === 'chartType'">
          <el-radio-group v-model="chartType" size="mini">
            <el-radio-button
              v-for="i in chartTypes"
              :label="i.type"
              :key="i.type"
            >
              {{ i.title }}
            </el-radio-button>
          </el-radio-group>
        </div>

        <fillInTitle v-if="key === 'title'" v-model="getTitleObj"></fillInTitle>

        <legendPanel
          v-if="key === 'legend'"
          v-model="getLegendObj"
        ></legendPanel>

        <nodePanel v-if="key === 'node'" v-model="nodePanelOption"></nodePanel>

        <dataConfiguransionPanel
          v-if="key === 'data'"
          v-model:exportData="chartOptionData"
        ></dataConfiguransionPanel>
      </template>
    </configurationItem>
  </div>
</template>

<script setup lang="ts">
import {
  chartConfiguration,
  chartTypes,
  titleObj,
  legendObj,
  axisNodes,
  seriesOption,
} from "@/views/configureChair/components/ts/chartData";
import configurationItem from "./configurationItem .vue";
// 标题
import fillInTitle from "./fillInTitle.vue";
// 图例
import legendPanel from "./legendPanel.vue";
// 数据
import dataConfiguransionPanel from "./dataConfiguransionPanel.vue";
// 节点
import nodePanel from "./nodePanel.vue";
import { ref, reactive, watch, provide, toRaw } from "vue";
import { decideIsArrayFun } from "@/plugins/decideFun";
import { cloneDeep } from "lodash";

const chartType = ref("line");
provide("chartType", chartType);

// 标题配置项
let getTitleObj = reactive(cloneDeep(titleObj));
// 图例配置项
let getLegendObj = reactive(cloneDeep(legendObj));
// 节点配置项
let nodePanelOption = reactive(cloneDeep(axisNodes));
provide("nodePanelOption", nodePanelOption);
// 数据配置项
let chartOptionData = reactive(cloneDeep(seriesOption));

// watch(getTitleObj, (newVal)=> {
//   console.log('--- 标题配置项 ---', toRaw(newVal));
// }, {deep: true})
// watch(getLegendObj, (newVal)=> {
//   console.log('--- 图例配置项 ---', toRaw(newVal));
// }, {deep: true});
// watch(nodePanelOption, (newVal)=> {
//   console.log('--- 节点配置项 ---', toRaw(newVal));
// }, {deep: true})
// watch(
//   chartOptionData,
//   (newVal) => {
//     console.log("--- 数据配置项 ---", toRaw(newVal));
//   },
//   { deep: true }
// );

// 获取图表所有参数
let getChartData = () => {
  let option = {
    chart: {
      type: chartType.value,
    },
    ...processingParametersTitle(toRaw(getTitleObj)),
    ...toRaw(getLegendObj),
    ...processingParametersXAxisAndSeries(),
  };
  // console.log("--- 获取图表所有参数 ---", option);

  return option;
};

// 处理标题配置项参数
let processingParametersTitle = (list: { [key: string]: any }) => {
  // 标题不展示时,清空参数
  let { title, subtitle } = list || {};
  let enabledDecide = (
    data: {
      [key: string]: any;
    } = {},
    key: string
  ) => {
    if (!data[key]) {
      return {};
    } else {
      return data;
    }
  };

  title = enabledDecide(title, "enabled");
  subtitle = enabledDecide(subtitle, "enabled");

  return {
    title,
    subtitle,
  };
};

// 处理节点与数据配置项参数
let processingParametersXAxisAndSeries = () => {
  let { nodes, categories, textarea } = toRaw(nodePanelOption.axis);
  let categoriesArr = [];
  let series: object[] = [];
  // 节点
  for (let i = 0; i < nodes; i++) {
    let arr = textarea.split("/");
    categoriesArr.push(
      categories === "custom" ? arr[i] || `未定义${i + 1}` : `节点${i + 1}`
    );
  }
  // 数据
  let { list } = toRaw(chartOptionData);
  decideIsArrayFun(list, () => {
    list.forEach((item) => {
      let obj: {
        data: any[];
      } = {
        data: [],
      };
      decideIsArrayFun(item, () => {
        for (let i = 0; i < nodes; i++) {
          obj.data.push(item[i]);
        }
      });
      series.push(obj);
    });
  });

  let data = {
    xAxis: {
      categories: categoriesArr,
    },
    series,
  };
  return data;
};

defineExpose({ getChartData });
</script>

<style scoped lang="less">
.main {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  .chart_type {
    padding: 0 10px;
  }
  .all_title {
    width: 80px;
    padding-right: 5px;
    text-align: right;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>
