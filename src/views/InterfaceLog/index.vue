<template>
  <div class="log_box">
    <div class="title_box">接口日志</div>
    <div class="table_box" v-loading="loading">
      <el-table
        :data="tableData"
        style="width: 100%"
        height="100%"
        :border="true"
        show-overflow-tooltip
      >
        <el-table-column
          v-for="{ label, prop, width, fixed } in column"
          :key="prop"
          :prop="prop"
          :label="label"
          :width="width || ''"
          :fixed="fixed || false"
        >
          <template #default="{ row }">
            {{ getColumnData(row, prop) }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination_box">
      <!-- 
       -->
      <el-pagination
        :page-sizes="[20, 50, 100]"
        :page-size="pagination.pageSize"
        :current-page.sync="pagination.currentPage"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script setup lang="ts">
import { column } from "./tableColumn";
import { axiosFun } from "@/plugins/axiosFun";
import { ref, reactive, toRaw, nextTick } from "vue";
import { ElMessage } from "element-plus";
import moment from "moment";

// 表格数据
let tableData: { [key: string]: string | Date }[] = reactive([]);
// 分页参数
let pagination = reactive({
  currentPage: 1,
  pageSize: 100,
  total: 1000,
});
let loading = ref(false);

let handleSizeChange = (value: number) => {
  pagination.pageSize = value;
  getLogList();
};
let handleCurrentChange = (value: number) => {
  pagination.currentPage = value;
  getLogList();
};

// 获取日志数据
let getLogList = async () => {
  loading.value = true;
  const { data, code } = await axiosFun("/users/log", "post", {
    ...pagination,
  });

  if (code === 200) {
    tableData.length = 0;
    if (data && Array.isArray(data.data)) {
      tableData.push(...data?.data);
    } else {
    }
    pagination.total = data.total;
  } else {
    ElMessage.warning("无法获取接口日志数据, 请稍后再试!");
  }

  nextTick(() => {
    loading.value = false;
  });
};

// 解析表格数据
let getColumnData = (row: { [key: string]: string | Date }, key: string) => {
  let data = toRaw(row);
  let dataItem = data[key];
  if (key === "date") {
    return moment(dataItem).format("YYYY-MM-DD HH:mm:ss") || "--";
  } else {
    return dataItem || "--";
  }
};

getLogList();
</script>

<style scoped lang="less">
@paginationHeight: 42px;
.log_box {
  width: 100%;
  height: 100%;
  .title_box {
    height: @paginationHeight;
    font-size: 16px;
    padding-top: 10px;
    font-weight: 800;
    box-sizing: border-box;
    text-align: center;
  }
  .table_box {
    height: calc(100% - @paginationHeight * 2);
  }
  .pagination_box {
    height: @paginationHeight;
    padding: 10px 0 0 0;
    .el-pagination {
      justify-content: end !important;
    }
  }
}
</style>
