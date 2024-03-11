<template>
  <div>
    <el-table
      :data="showTable ? (showTablePreview ? data : []) : data"
      :border="true"
    >
      <el-table-column
        v-for="{ label, value } in columnList"
        :prop="value"
        :label="label"
        min-width="80"
      >
        <template #default="scope">
          {{ decideIsNaNFn(scope.row[value]) }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { decideIsArrayFun } from "@/plugins/decideFun";
import { inject, reactive, toRaw, watch } from "vue";

// 节点配置项
let nodePanelOption: any = inject("nodePanelOption");
const props = defineProps(["data", "showTable", "showTablePreview"]);

// 表格表头
let columnList: { [key: string]: string | number }[] = reactive([]);
// 图表数据
let data = reactive([]);

let init = () => {
  columnList.length = 0;
  let { nodes, categories, textarea } = toRaw(nodePanelOption.axis);
  for (let i = 0; i < nodes; i++) {
    let arr = textarea.split("/");
    columnList.push({
      label:
        categories === "custom" ? arr[i] || `未定义${i + 1}` : `节点${i + 1}`,
      value: i,
    });
  }

  decideIsArrayFun(toRaw(props.data), (list: []) => {
    data.length = 0;

    list.forEach((item: any) => {
      let obj: {
        [key: string]: number | object;
      } = {};

      for (let i = 0; i < nodes; i++) {
        obj[i] = item[i];
      }
      data.push(obj);
    });
  });
};

init();

watch(
  [props.data, nodePanelOption],
  () => {
    init();
  },
  { deep: true }
);

// 判断是否为非数字类型
let decideIsNaNFn = (value: any) => {
  return isNaN(value) || typeof value !== "number" ? "--" : value;
};

defineExpose({ columnList });
</script>

<style scoped lang="less"></style>
