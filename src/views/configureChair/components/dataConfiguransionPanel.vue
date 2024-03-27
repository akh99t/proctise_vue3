<template>
  <!-- 数据配置面板 -->
  <div class="data_configuransion_panel">
    <shareBoxFlex v-for="item in cloneDataOption" :key="item.key">
      <template v-slot:label> {{ item.label }} </template>
      <template #conter>
        <div
          class="content_box icon"
          v-if="['explain'].includes(item.type || '')"
        >
          <el-popover placement="right" trigger="hover" width="auto">
            <template #reference>
              <el-icon>
                <InfoFilled />
              </el-icon>
            </template>
            导入数据的节点个数基于 [节点] 配置, 导入数据上限
            {{ exportDataToplimit }} 条
          </el-popover>
        </div>

        <div class="content_box" v-if="['button'].includes(item.type || '')">
          <el-button
            size="mini"
            v-for="i in item.data"
            :key="i.label"
            @click="buttonClick(i)"
            >{{ i.value }}</el-button
          >
        </div>
      </template>
    </shareBoxFlex>

    <shareBoxFlex style="margin: 0">
      <template v-slot:label> 数据 </template>
      <template #conter>
        <dataTable :data="exportData.list"></dataTable>
      </template>
    </shareBoxFlex>

    <!-- 弹出对话框 -->
    <el-dialog
      v-model="dialogVisible"
      @close="closeDialog"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <dataGeneration
        v-if="dialogVisible"
        :exportDataToplimit="exportDataToplimit"
        :dialogShowData="dialogShowData"
        v-model="cloneDeepExportData.list"
        :exportData="exportData"
      ></dataGeneration>

      <template #footer>
        <div class="dialog_footer">
          <el-button size="mini" @click="closeDialog">关闭</el-button>

          <el-tooltip
            class="box-item"
            effect="dark"
            content="请校验数据无误后导出!"
            :disabled="cloneDeepExportData.list.length"
            placement="top"
          >
            <el-button
              type="primary"
              size="mini"
              @click="exportDataFun"
              :disabled="!cloneDeepExportData.list.length"
              >导出</el-button
            >
          </el-tooltip>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import shareBoxFlex from "@/components/shareBox/shareBoxFlex.vue";
import dataGeneration from "./dataGeneration.vue";
import dataTable from "./dataTable.vue";
import { dataOption } from "./ts/chartData";
import { ref, reactive, watch, toRaw } from "vue";
import { cloneDeep } from "lodash";
const props = defineProps(["exportData"]);
const emits = defineEmits(["update:exportData"]);

let cloneDataOption = cloneDeep(dataOption);
let dialogVisible = ref(false);
// 导入数据上限条数
let exportDataToplimit = ref(5);
// 记录打开对话框的按钮
let dialogShowData = reactive({});
// 导出数据集合 克隆
let cloneDeepExportData = reactive(cloneDeep(props.exportData));

// 按钮事件
let buttonClick = (item: { [key: string]: string }) => {
  console.log("--- 按钮事件 buttonClick ---", item);
  let { label } = item;
  if (["randomData"].includes(label || "")) {
    // 随机数据
  } else if (["excel", "JSON"].includes(label || "")) {
    // 打开对话框
    dialogVisible.value = true;
    Object.assign(dialogShowData, item);
  }
};

// 对话框事件
// 关闭
let closeDialog = function () {
  dialogVisible.value = false;
};
// 导出数据
let exportDataFun = function () {
  synchroData();
  closeDialog();
};

// 数据同步 - 双向绑定
let synchroData = () => {
  // 将组件内的数据通过v-medel传递出去
  cloneDeepExportData;
  props.exportData.list.length = 0;
  props.exportData.list.push(...cloneDeepExportData.list);
};
</script>

<style scoped lang="less">
.data_configuransion_panel {
  // .content_box {}
  // .icon {}
  .dialog_footer {
    padding: 0 10px;
  }
}
</style>
