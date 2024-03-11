<template>
  <!-- 图表配置项 -->
  <div class="configurasion_box">
    <header>图表配置项</header>
    <div class="main_box">
      <configurasionMain ref="configurasionMainFun" />
    </div>
    <footer>
      <el-button size="mini" @click="previewFun()">预览</el-button>
      <el-button type="primary" size="mini" disabled>导出</el-button>
      <el-button type="primary" size="mini" disabled>保存</el-button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import mitt from "@/plugins/mitt";
import configurasionMain from "./components/configurasionMain.vue";
import { ref, onMounted } from "vue";
const configurasionMainFun = ref();

let previewFun = () => {
  revaalChart();
};

// 获取数据加载图表
let revaalChart = () => {
  let { getChartData } = configurasionMainFun.value;
  let option = getChartData()
  console.log('--- 获取数据加载图表 ---', option);
  
  mitt.emit("chartOptionData", option);
};

onMounted(() => {
  setTimeout(() => {
    // 初始化时组件返回数据有延迟
    revaalChart();
  }, 500);
});
</script>

<style src="./components/configurasion.less" lang="less" scoped></style>
