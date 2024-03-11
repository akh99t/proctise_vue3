<template>
  <div class="show_content">
    <div class="show_content_item" v-for="item in list" :key="item">
      <chartDisplay ref="chartDisplayFun" :type="item" />
    </div>
  </div>
</template>

<script setup lang="ts">
import chartDisplay from "@/components/chartDisplay/index.vue";
import { ref, toRaw, onUnmounted } from "vue";
import mitt from "@/plugins/mitt";

let list = ref(["chart", "table"]);
const chartDisplayFun = ref();

// 更新图表与表格
const allUpdateFun = (data: object = {}) => {
  let refArr = toRaw(chartDisplayFun.value) || [];
  refArr.forEach((item: any) => {
    let { initData } = item;
    initData ? initData(data) : initData;
  });
};

mitt.on("chartOptionData", (data: any) => {
  // console.log('--- chart 图表参数 ---', data);
  allUpdateFun(data)
});

onUnmounted(()=> {
  mitt.all.clear()
})
defineExpose({ allUpdateFun });
</script>

<style scoped lang="less">
.show_content {
  height: 100%;
  padding: 5px;
  background-color: #fff;
  box-sizing: border-box;
  .show_content_item {
    height: calc(50% - 3px);
    background-color: #ccc;
  }
  .show_content_item:first-child {
    margin-bottom: 6px;
  }
}
</style>