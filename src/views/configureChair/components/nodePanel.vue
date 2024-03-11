<template>
  <!-- 数据配置面板 -->
  <div class="data_configuransion_panel">
    <shareBoxFlex v-for="item in cloneDeepNodeOption" :key="item.key">
      <template v-slot:label> {{ item.label }} </template>

      <template #conter>
        <div
          class="content_box"
          v-if="['inputNumber'].includes(item.type || '')"
        >
          <el-input-number
            v-model="item.value"
            :min="1"
            :max="15"
            size="mini"
          ></el-input-number>
        </div>

        <div
          class="content_box"
          v-if="['radioGroup'].includes(item.type || '')"
        >
          <el-radio-group v-model="item.value" size="mini">
            <el-radio-button
              v-for="i in item.data"
              :key="i.label"
              :label="i.label"
              >{{ i.value }}</el-radio-button
            >
          </el-radio-group>
        </div>
      </template>
    </shareBoxFlex>

    <shareBoxFlex v-if="showTextarea">
      <template v-slot:label> 自定节点</template>

      <template #conter>
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请以 “/” 为分隔符自定义X轴节点
例如: 一季度/二季度/三季度/四季度"
          v-model="textarea"
          :maxlength="60"
        >
        </el-input>
      </template>
    </shareBoxFlex>
  </div>
</template>

<script setup lang="ts">
import shareBoxFlex from "@/components/shareBox/shareBoxFlex.vue";
import { nodeOption } from "./ts/chartData";
import { cloneDeep, debounce } from "lodash";
import { ref, reactive, watch, toRaw } from "vue";

// 节点配置项数组
let cloneDeepNodeOption = reactive(cloneDeep(nodeOption));
// 是否自定义节点-文本域输入框
let showTextarea = ref(false);
let textarea = ref("");

const props = defineProps(["modelValue"]);
const emits = defineEmits(["update:modelValue"]);
watch(
  cloneDeepNodeOption,
  (newVal) => {
    getShowTextarea();
  },
  { deep: true }
);

// 监听数据变化, 返回给上级, 实现双向数据绑定
watch(
  props.modelValue,
  (newVal) => {
    manipulationDataFun();
    // console.log('--- 监听数据变化, 返回给上级, 实现双向数据绑定 ---', data, props.modelValue);
    emits("update:modelValue", newVal);
  },
  { deep: true }
);
watch(
  [cloneDeepNodeOption, textarea],
  () => {
    manipulationDataFun();
  },
  { deep: true }
);

// 获取showTextarea的值
let getShowTextarea = () => {
  let arr = toRaw(cloneDeepNodeOption);
  let data = false;
  arr.forEach((item) => {
    if (item.key === "categories") {
      data = item.value === "custom";
    }
  });
  showTextarea.value = data;
};

// 处理配置项数据
let manipulationDataFun = () => {
  props.modelValue.axis.textarea = textarea.value;
  let arr = toRaw(cloneDeepNodeOption);
  arr.forEach((item) => {
    props.modelValue.axis[item.key] = item.value;
  });
};
</script>

<style scoped lang="less">
// .data_configuransion_panel {
//   .content_box {}
// }
</style>
