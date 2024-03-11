<template>
  <shareBoxFlex lableWidth="70px">
    <template v-slot:label>
      {{ dialogShowData.value }}
    </template>
    <template #conter>
      <div v-if="['JSON'].includes(dialogShowData.label || '')">
        <el-input
          v-model="exportDataObj.JSON"
          style="width: 100%"
          :rows="10"
          type="textarea"
          maxlength="300"
          show-word-limit
          :placeholder="JSONStr"
        />
      </div>
      <div v-if="['excel'].includes(dialogShowData.label || '')">
        <el-upload
          ref="elUploadRef"
          v-model:file-list="exportDataObj.fileList"
          class=""
          :drag="true"
          action=""
          :auto-upload="false"
          :on-change="changeUpload"
          :limit="limit"
          :on-exceed="handleExceed"
        >
          <el-button type="primary">上传excel文件</el-button>
          <template #tip>
            <div class="el-upload__tip">
              请点击上传或拖拽上传excel文件, 文件大小限制 {{ uoloadFileSize }} M
            </div>
          </template>
        </el-upload>
      </div>
    </template>
  </shareBoxFlex>

  <shareBoxFlex lableWidth="70px">
    <template v-slot:label> 数据校验 </template>
    <template #conter>
      <div>
        <el-button
          v-if="['JSON'].includes(dialogShowData.label || '')"
          size="mini"
          @click="checkoutJSON"
          >JSON校验</el-button
        >
        <el-button
          v-if="['excel'].includes(dialogShowData.label || '')"
          size="mini"
          @click="checkoutExcel"
          >excel校验</el-button
        >
        <el-button
          v-if="['excel'].includes(dialogShowData.label || '')"
          size="mini"
          @click="downloadExcel"
          >下载excel模板</el-button
        >
      </div>
    </template>
  </shareBoxFlex>

  <shareBoxFlex lableWidth="70px">
    <template v-slot:label> 说明 </template>

    <template #conter>
      <el-popover placement="right" trigger="hover" width="auto">
        <template #reference>
          <el-icon>
            <InfoFilled />
          </el-icon>
        </template>
        请先数据校验无误后, 方可导出数据!
      </el-popover>
    </template>
  </shareBoxFlex>

  <shareBoxFlex lableWidth="70px">
    <template v-slot:label> 数据预览 </template>
    <template #conter>
      <dataTable
        :data="modelValue"
        :showTable="true"
        :showTablePreview="showTablePreview"
        ref="dataTableRef"
      ></dataTable>
    </template>
  </shareBoxFlex>
</template>

<script setup lang="ts">
import shareBoxFlex from "@/components/shareBox/shareBoxFlex.vue";
import dataTable from "./dataTable.vue";
import { decideIsArrayFun } from "@/plugins/decideFun";
import { reactive, toRaw, watch, ref, inject, onMounted } from "vue";
import { cloneDeep } from "lodash";
import { ElMessage } from "element-plus";
import * as xlsx from "xlsx";

// 注入节点数据
let nodePanelOption: any = inject("nodePanelOption");
// 数据预览表格
let dataTableRef = ref();

const props = defineProps([
  "modelValue",
  "dialogShowData",
  "exportDataToplimit",
]);
const emits = defineEmits(["update:modelValue"]);

watch(props.modelValue, (newVal) => {
  emits("update:modelValue", newVal);
});

onMounted(() => {
  // 清空数据, 让上级导出按钮禁用
  props.modelValue.length = 0;
})

// 是否展示数据预览
let showTablePreview = ref(false);

let JSONStr = `JSON格式如下:
[
    [1, 2, 3, 4, 5],
    [5, 3, 12, null, 1]
]
`;
// 限制上传文件数
let limit = ref(1);
// 限制上传文件大小
let uoloadFileSize = ref(0.5);
// 允许上传文件类型
let excelTypes = ["xlsx"];

// JSON校验并生成数据
let checkoutJSON = () => {
  showTablePreview.value = false;
  let text = exportDataObj.JSON;
  // let emptyTabelData = () => {
  //   props.modelValue.length = 0;
  // };
  if (!text) {
    // emptyTabelData();
    return ElMessage.warning("输入框不可为空!");
  }
  try {
    let data: any = JSON.parse(text);

    decideIsArrayFun(
      data,
      () => {
        // emptyTabelData();
        let list: any = [];
        let arr: any[] = [];
        data.forEach((item: any) => {
          decideIsArrayFun(item, (item: []) => {
            arr = [];
            item.forEach((i) => {
              let num: number | null = i;
              if (
                typeof i !== "number" &&
                (isNaN(i) || typeof i === "object")
              ) {
                num = null;
              }
              arr.push(num);
            });
          });
          list.push(arr);
        });

        console.log("--- JSON校验通过并生成数据 ---", data);
        props.modelValue.push(
          ...list.splice(0, props.exportDataToplimit || list.length)
        );
        showTablePreview.value = true;
      },
      () => {
        // emptyTabelData();
        ElMessage.warning("请遵循JSON格式规范!");
        console.error("--- 请遵循JSON格式规范 ---", data);
      }
    );
  } catch (err) {
    // emptyTabelData();
    ElMessage.warning("JSON格式不准确!");
    console.error("--- JSON格式不准确 ---", err);
  }
};

// 上传组件实例
const elUploadRef = ref();

// 上传文件触发事件
// 上传change
let changeUpload = (uploadFile: any, uploadFiles: any) => {
  showTablePreview.value = false;
  let { name, size } = uploadFile;
  if (size / 1024 / 1024 > uoloadFileSize.value) {
    let { handleRemove } = elUploadRef.value;
    ElMessage.warning(`文件大小超出 ${uoloadFileSize.value} M`);
    handleRemove(uploadFile);
  } else if (!excelTypes.includes(name.split(".")[1] || "")) {
    let { handleRemove } = elUploadRef.value;
    ElMessage.warning(
      `文件类型有误! 请上传以下类型文件: ${excelTypes.join(", ")}`
    );
    handleRemove(uploadFile);
  }
};
// 当超出限制时，执行的钩子函数
let handleExceed = () => {
  ElMessage.warning(`当前文件上传数量限制: ${limit.value}`);
};

// excel文件校验并生成数据
let checkoutExcel = () => {
  showTablePreview.value = false;
  if (exportDataObj.fileList.length) {
    const reader = new FileReader();
    let file = exportDataObj.fileList[0];
    reader.readAsArrayBuffer(file.raw);

    // 解析文件
    reader.onload = (e: { [key: string]: any }) => {
      let data = e.target.result;
      let workbook = xlsx.read(data, {
        type: "binary",
      });

      let { utils } = xlsx;
      if (workbook?.Sheets?.hasOwnProperty("Sheet1")) {
        // 获取的文档处理成数据 并且切除超额部分
        let excelList = utils.sheet_to_json(workbook?.Sheets?.Sheet1) || [];
        let excelDataList: any[] = [];
        if (excelList && !excelList.length) {
          ElMessage.warning(`无法获取数据, 请确认上传文件数据无误! `);
          return;
        }

        // columnList - 节点数据
        let { columnList } = dataTableRef.value;
        let columnListMap = columnList.map((item: { label: string }) => {
          return item.label;
        });

        // 已获取excel数据, 处理
        excelList.forEach((item: any) => {
          let excelDataListItem: any[] = [];
          columnListMap.forEach((label: string) => {
            let value = typeof item[label] === "number" ? item[label] : null;
            excelDataListItem.push(value);
          });
          let { nodes } = toRaw(nodePanelOption.axis);
          excelDataListItem = excelDataListItem.splice(
            0,
            nodes || excelDataListItem.length
          );
          excelDataList.push(excelDataListItem);
        });

        props.modelValue.length = 0;
        props.modelValue.push(
          ...excelDataList.splice(
            0,
            props.exportDataToplimit || excelDataList.length
          )
        );

        showTablePreview.value = true;
      }
    };
  } else {
    ElMessage.warning(`请先上传文件! `);
  }
};

// 下载excel模板
let downloadExcel = () => {
  let { utils, writeFile } = xlsx;
  // 将数据转换为工作簿对象
  let { columnList } = dataTableRef.value;
  let toExcelData: any[] = [];
  let columnListMap = columnList.map((item: { label: string }) => {
    return item.label;
  });
  let modelValueToRaw = props.modelValue;
  modelValueToRaw.forEach((item: []) => {
    let obj: {
      [key: string]: any;
    } = {};
    item.forEach((i, index) => {
      obj[columnListMap[index]] = typeof i === "number" ? i : null;
    });
    toExcelData.push(obj);
  });

  // 导出数据模板,  数据不宜过多过少, 处理
  if (toExcelData.length > 3) {
    toExcelData = [...toExcelData.splice(0, 3)];
  } else if (toExcelData.length === 1) {
    toExcelData = [toExcelData[0], toExcelData[0]];
  }

  // 将数据转为excel, 下载
  let worksheet = utils.json_to_sheet(toExcelData);
  let workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Sheet1");
  writeFile(workbook, "excel数据导入[模板].xlsx");
};

// 导出数据集合
let exportDataObj: {
  JSON: string;
  fileList: any[];
} = reactive({
  JSON: "",
  fileList: [],
});

// 监听导入数据
watch(
  showTablePreview,
  (newVal) => {
    console.log("---  监听导入数据 showTablePreview ---", newVal, props.modelValue);
  },
  { deep: true }
);
</script>

<style scoped lang="less"></style>
