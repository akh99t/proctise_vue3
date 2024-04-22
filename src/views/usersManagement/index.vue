<template>
  <div class="users_box">
    <div class="title_box">用户列表</div>
    <div class="table_box">
      <el-table
        :data="tableData"
        style="width: 100%"
        height="100%"
        :border="true"
        show-overflow-tooltip
        v-loading="loading"
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
            <div v-if="prop === 'grade'">
              <el-tag
                :type="row[prop] === 0 ? 'danger' : 'success'"
                effect="dark"
              >
                {{ gradeName(row, prop) }}
              </el-tag>
            </div>
            <div class="console_desk_box" v-else-if="prop === 'consoleDesk'">
              <el-button
                type="primary"
                text
                :disabled="
                  disabledFun(row, 'exceptOperation', 'consoleDesk_del')
                "
                @click="logoutAccount(row)"
                >注销</el-button
              >
              <el-button type="primary" text disabled>备注</el-button>
            </div>
            <span v-else>
              {{ getColumnData(row, prop) }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination_box">
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
import { column } from "./tableColumnList";
import { axiosFun } from "@/plugins/axiosFun";
import { ref, reactive, toRaw, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import moment from "moment";

// 表格数据
let tableData: { [key: string]: string | Date }[] = reactive([]);
// 分页参数
let pagination: { [key: string]: number } = reactive({
  currentPage: 1,
  pageSize: 100,
  total: 1000,
});
let loading = ref(false);

let handleSizeChange = (value: number) => {
  pagination.pageSize = value;
  geUsersList();
};
let handleCurrentChange = (value: number) => {
  pagination.currentPage = value;
  geUsersList();
};

// 获取用户列表
let geUsersList = async () => {
  loading.value = true;
  const { data, code } = await axiosFun("/users/usersList", "post", {
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
    ElMessage.warning("无法获取用户列表数据, 请稍后再试!");
  }

  nextTick(() => {
    loading.value = false;
  })
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

// 标签
let gradeName = (row: { [key: string]: number }, key: string) => {
  let data: number = toRaw(row)[key];
  let obj: { [key: number]: string } = {
    0: "管理员",
    1: "普通用户",
  };
  return obj[data];
};

// 判断是否disabled
let disabledFun = (
  row: { [key: string]: boolean },
  key: string,
  type: string
): boolean => {
  if (type === "consoleDesk_del" && typeof row[key] === "boolean") {
    return row[key];
  } else {
    return false;
  }
};

geUsersList();

// 注销账号
let logoutAccount = (data: { [key: string]: any }) => {
  const { userName, _id } = toRaw(data) || {};
  const ELPromise = ElMessageBox.confirm(
    `此操作不可逆, 是否注销 ${userName} ?`,
    "警告",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  );
  ELPromise.then(async () => {
    const { data, code } = await axiosFun("/users/deleteUser", "post", {
      _id,
    });
    if (code === 200) {
      await geUsersList();
      ElMessage.success("注销成功!");
    } else {
      ElMessage.error("注销失败!");
    }
  }).catch(() => {});
};
</script>

<style scoped lang="less">
@paginationHeight: 42px;
.users_box {
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
<style lang="less">
.users_box {
  .console_desk_box {
    .el-button {
      padding-left: 0;
    }
  }
}
</style>
