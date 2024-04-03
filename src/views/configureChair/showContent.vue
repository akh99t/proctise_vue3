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

let chartOptionDataFun = (data: any) => {
  allUpdateFun(data)
}
let mittGet = mitt.all.get('chartOptionData')
if (mittGet && mittGet.length) {
  // 已经添加了事件监听器
} else {
  mitt.on("chartOptionData", chartOptionDataFun);
}

onUnmounted(()=> {
  // mitt.all.clear()
  mitt.off('chartOptionData', chartOptionDataFun);
})
defineExpose({ allUpdateFun });
</script>

<style scoped lang="less">
.show_content {
  height: 100%;
  // padding: 5px;
  // background-color: #fff;
  box-sizing: border-box;
  .show_content_item {
    height: calc(50% - 5px);
    background-color: #a0cfff;
  }
  .show_content_item:first-child {
    margin-bottom: 10px;
  }
}
</style>