<template>
  <div class="title_box">
    <div class="title_item">
      <div class="text">主标题</div>
      <titlePanel
        type="title"
        :titleOption="hostTitleOption"
        v-model="modelValue.title"
      >
      </titlePanel>
    </div>

    <div class="title_item">
      <div class="text">
        <span>
          副标题
        </span>
      </div>
      <titlePanel
        type="subtitle"
        v-model="modelValue.subtitle"
        :titleOption="subtitleOption"
        :inputMaxLength="20"
      >
      </titlePanel>
    </div>
  </div>
</template>

<script setup lang="ts">
import titlePanel from "./titlePanel.vue";
import { titleOptionFn } from "@/views/configureChair/components/ts/chartData";
import { ref, inject, reactive, watch, onBeforeMount, toRaw } from "vue";
import { cloneDeep } from "lodash";

const props = defineProps(["modelValue"]);
const emits = defineEmits(["update:modelValue"]);

watch(
  props.modelValue,
  (newValue) => {
    emits("update:modelValue", newValue);
  },
  {
    deep: true,
  }
);
let chartType:any = inject("chartType");

let titleOptionObj: {
  [key: string]: any;
} = reactive({});
let hostTitleOption = reactive([]);
let subtitleOption = reactive([]);


let titleOptionObjFun = (newValue: string) => {
  // ["line", "area", "bar"]类型的配置数据备份, 目的是切换图表时保留配置
  let switchDataFun = (key: string) => {
    let updateArr = (arr:any, newArr:any) => {
      arr.length = 0
      arr.push(...toRaw(newArr))
    }
    updateArr(hostTitleOption, titleOptionObj[key].hostTitleOption)
    updateArr(subtitleOption, titleOptionObj[key].subtitleOption)
    
  };
  if (!titleOptionObj[newValue]) {
    if (["line", "area", "bar"].includes(newValue)) {
      titleOptionObj[newValue] = {
        hostTitleOption: cloneDeep(titleOptionFn('title')),
        subtitleOption: cloneDeep(titleOptionFn('subtitle')),
      };
      switchDataFun(newValue);
    } else if (["pie"].includes(newValue)) {
    } else if (["top"].includes(newValue)) {
    }
  } else {
    if (["line", "area", "bar"].includes(newValue)) {
      switchDataFun(newValue);
    }
  }
};
watch(
  () => chartType.value,
  (newValue) => {
    titleOptionObjFun(newValue);
  }
);
onBeforeMount(() => {
  titleOptionObjFun(chartType.value);
});

// watch(
//   titleOptionObj,
//   (newValue, oldValue) => {
//     console.log("---- watch titleOptionObj -----", newValue);
//   },
//   {
//     deep: true,
//   }
// );
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