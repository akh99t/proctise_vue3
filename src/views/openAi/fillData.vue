import { ref, watch, toRaw } from 'vue';
<template>
  <div class="fill_data">
    <slot></slot>
    <div class="el_slider_box" v-if="type === 'slider'">
      <el-slider
        v-model="value"
        :step="data.step || 1"
        :max="data.max || 1"
        :min="data.min || 0"
        :show-stops="showStopsFun()"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRaw, watch } from "vue";
const props = defineProps(["modelValue", "data", "type"]);
const emits = defineEmits(["update:modelValue"]);
let value = ref(props.modelValue);

watch(
  () => value,
  (newVal) => {
    emits("update:modelValue", newVal.value);
  },
  { deep: true }
);

let showStopsFun = () => {
  let { min, max, step } = toRaw(props.data);
  let num = (max - min) / step;
  if (num < 20) {
    return true;
  } else {
    return false;
  }
};
</script>

<style scoped lang="less">
.fill_data {
  .el_slider_box {
    width: 100%;
    box-sizing: border-box;
    padding: 0 10px;
  }
}
</style>
