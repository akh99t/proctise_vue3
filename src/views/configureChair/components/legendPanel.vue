<template>
  <div class="title_box">
    <div class="title_item">
      <titlePanel
        ref="titlePanelRef"
        v-model="modelValue.legend"
        :titleOption="getLegendOptionItem"
        type="legend"
      >
      </titlePanel>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onBeforeMount, inject, toRaw, onMounted } from "vue";
import { legendOption } from "@/views/configureChair/components/ts/chartData";
import titlePanel from "./titlePanel.vue";
import { cloneDeep } from "lodash";

const props = defineProps(["modelValue"]);
const emits = defineEmits(["update:modelValue"]);

const titlePanelRef = ref()

// 存贮当前切换的图表类型所用的数据
let getLegendOptionItem = reactive([]);

watch(
  () => props.modelValue,
  (newValue) => {
    emitsDataFun();
  },
  {
    deep: true,
  }
);

let chartType: any = inject("chartType");

let getLegendOption: {
  [key: string]: any;
} = reactive({});

// 切换图表类型, 保存上一图表配置项, 并切换当前图表配置项
let legendOptionObjFun = (newValue: string) => {
  // 切换为当前图表所用的数据, 触发数据更新事件
  let switchDataFun = (arr: []) => {
    getLegendOptionItem.length = 0;
    getLegendOptionItem.push(...toRaw(arr));
  };
  if (!getLegendOption[newValue]) {
    // ["line", "area", "bar"]类型的配置数据备份, 目的是切换图表时保留配置
    if (["line", "area", "bar"].includes(newValue)) {
      getLegendOption[newValue] = cloneDeep(legendOption);
      switchDataFun(getLegendOption[newValue]);
    } else if (["pie"].includes(newValue)) {
    } else if (["top"].includes(newValue)) {
    }
  } else {
    if (["line", "area", "bar"].includes(newValue)) {
      switchDataFun(getLegendOption[newValue]);
    }
  }
};

// 将数据传递出去
let emitsDataFun = () => {
  emits("update:modelValue", props.modelValue);
  // let { watchTitleOptionFun } = titlePanelRef.value
  // watchTitleOptionFun(getLegendOptionItem);
};

watch(
  () => chartType.value,
  (newValue) => {
    legendOptionObjFun(newValue);
  }
);

onMounted(() => {
  legendOptionObjFun(chartType.value);
  emitsDataFun();
})
</script>

<style scoped lang="less">
.title_box {
  .title_item {
    .text {
      line-height: 30px;
      text-align: center;
      span {
        position: relative;
        display: inline-block;
        .switch_box {
          width: 50px;
          height: 30px;
          position: absolute;
          right: -50px;
          top: 0;
          line-height: 28px;
        }
      }
    }
    .option_item {
      display: flex;
      .item_text {
        width: 80px;
        text-align: right;
        box-sizing: border-box;
        padding-right: 5px;
      }
    }
  }
}
</style>
