<template>
  <!-- <div class="panel_box">
    <div class="label">
      <slot name="label"></slot>
    </div>
    <div class="operation">
      <slot name="operation"></slot>
    </div>
  </div> -->
  <div class="panel_box" v-for="item in titleOption" :key="item.key">
    <div class="label">
      {{ item.label }}
    </div>
    <div class="operation">
      <el-switch
        v-if="['floating'].includes(item.key) || ['switch'].includes(item.type)"
        :disabled="!disabled && !['switch'].includes(item.type)"
        v-model="item.value"
      >
      </el-switch>

      <el-input
        type="text"
        v-if="['input'].includes(item.type)"
        placeholder="请输入内容"
        v-model="item.value"
        :disabled="!disabled"
        :maxlength="inputMaxLength || 10"
        show-word-limit
      >
      </el-input>

      <el-radio-group
        v-if="['radioGroup'].includes(item.type)"
        v-model="item.value"
        size="mini"
        :disabled="!disabled"
      >
        <el-radio-button
          v-for="i in item.data"
          :key="i.label"
          :label="i.label"
          >{{ i.value }}</el-radio-button
        >
      </el-radio-group>

      <div class="xy_box" v-if="['xy'].includes(item.key)">
        <div class="slider_box">
          <el-tag type="info" effect="plain"> X轴 </el-tag>
          <span> </span>
          <el-slider
            :disabled="!disabled"
            v-model="item.value.x"
            :min="min"
            :max="max"
          >
          </el-slider>
        </div>
        <div class="slider_box">
          <el-tag type="info" effect="plain"> Y轴 </el-tag>
          <el-slider
            :disabled="!disabled"
            v-model="item.value.y"
            :min="min"
            :max="max"
          >
          </el-slider>
        </div>
      </div>

      <div class="color_picker" v-if="['backgroundColor'].includes(item.key)">
        <el-color-picker
          v-model="item.value"
          show-alpha
          :disabled="!disabled"
        ></el-color-picker>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { chartTypeClassify } from "@/views/configureChair/components/ts/chartData";
import {
  ref,
  watch,
  inject,
  computed,
  toRaw,
  onMounted,
  onBeforeMount,
} from "vue";
let min = ref(-100);
let max = ref(300);
const props = defineProps([
  "modelValue",
  "titleOption",
  "type",
  "inputMaxLength",
]);
const emits = defineEmits(["update:modelValue"]);

let chartType: any = inject("chartType");
let disabled = ref(true);

watch(
  props.titleOption,
  (newVal) => {
    // console.log("--- 输出 titleOption ---", props.type, props.titleOption);
    watchTitleOptionFun(newVal);
    disabled.value = getDisabledFun(newVal);
  },
  {
    deep: true,
  }
);

// 将当前配置项数据传递出去
const watchTitleOptionFun = (newVal: any) => {
  let data = toRaw(props.modelValue);
  let chartTypeClassifyA = chartTypeClassify.A.includes(chartType?.value || "");
  if (
    chartTypeClassifyA &&
    ["title", "subtitle", "legend"].includes(props.type)
  ) {
    // if (["subtitle"].includes(props.type) && !data.showSubtitle) {
    //   data.text = ''
    //   return emits("update:modelValue", data);
    // }
    let obj = toRaw(newVal);
    for (const k in obj) {
      let { key, value } = obj[k];
      if (key === "xy") {
        let { x, y } = value;
        data = {
          ...data,
          x,
          y,
        };
      } else {
        data[key] = value;
      }
    }
    // console.log("--- 数据变动, 返回数据 ---", props.type, obj, data);

    emits("update:modelValue", data);
  }
};

// 查找禁用变量
let getDisabledFun = (data: any) => {
  let disabled = true;
  let arr = toRaw(data) || [];
  arr.forEach((item: any) => {
    let { effect, value } = item || {};
    if (["disabled"].includes(effect)) {
      disabled = value;
    }
  });

  return disabled;
};

watchTitleOptionFun(props.titleOption);

defineExpose({ watchTitleOptionFun });
</script>

<style scoped lang="less">
@titleWidth: 60px;
.panel_box {
  display: flex;
  box-sizing: border-box;
  padding: 0 15px 0 10px;
  margin: 0 0 10px 0;
  .label {
    width: @titleWidth;
    font-size: 12px;
    box-sizing: border-box;
    padding-right: 5px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .operation {
    width: calc(100% - @titleWidth);
    .xy_box {
      width: 100%;
      .slider_box {
        display: flex;
        align-items: center;
      }
    }
    .color_picker {
      .el-color-picker__trigger {
        border: 1px solid #000 !important;
      }
    }
  }
}
.panel_box:last-child {
  margin: 0;
}
</style>
<style lang="less">
.panel_box {
  .operation {
    .slider_box {
      .el-tag {
        line-height: 24px;
      }
    }
    .color_picker {
      .el-color-picker {
        background-color: #fff;
        .el-color-picker__trigger {
          border: 1px solid #dcdfe6;
        }
      }
    }
  }
}
</style>
