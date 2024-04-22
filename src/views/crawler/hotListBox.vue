<template>
  <div class="hot_list_box">
    <div class="title_box">
      <div v-if="imgUrl" class="title_item image_box">
        <el-image referrerPolicy="no-referrer" :src="imgUrl" fit="cover">
          <template #error>
            <div class="image-slot">
              <el-icon><Picture /></el-icon>
            </div>
          </template>
        </el-image>
      </div>
      <div v-else class="title_item image_box" v-html="imgIcon"></div>
      {{ label || "--" }}
      <div class="title_item update_time">
        <span class="title_span"> update: </span>
        <el-tag v-if="updateTime" type="info" effect="plain">
          {{ updateTime }}
        </el-tag>
        <span v-else> -- </span>
      </div>
    </div>
    <div class="hr_box"></div>
    <main v-if="type !== 'option'">
      <div
        class="main_item"
        v-for="(item, index) in formattedData"
        :key="`${name}_main_item_key: ${index}`"
        @click="visitExternalPage(item.id)"
      >
        <div class="img_box">
          <el-image referrerPolicy="no-referrer" :src="item.imgUrl" fit="cover">
            <template #error>
              <div class="image-slot">
                <el-icon><Picture /></el-icon>
              </div>
            </template>
          </el-image>
        </div>
        <div class="content_box">
          <div class="content_box_item">
            <span class="content_title_box">
              {{ item.title }}
            </span>
            <div
              class="content_name_box"
              :class="{ content_name_box_hot: name === 'zhihuHot' }"
            >
              {{ item.name }}
            </div>
          </div>
          <div class="content_box_item" v-if="name === 'BLBLHot'">
            <div class="tag_box">
              <el-tag
                v-for="tagName in item.tags"
                :key="`tag_key: ${item.pic + tagName}`"
                size="small"
                type="danger"
                effect="dark"
              >
                {{ tagName }}
              </el-tag>
            </div>
            <div class="stat_box">
              <span>
                views: <span>{{ item.view }}</span>
              </span>
              <span>
                comments: <span>{{ item.reply }}</span>
              </span>
            </div>
          </div>
          <div class="content_box_item" v-else-if="name === 'zhihuHot'">
            <span class="content_title_box content_subtitle_box">
              {{ item.subtitle }}
            </span>
          </div>
        </div>
        <div class="index_box">
          {{ index + 1 }}
        </div>
      </div>
      <div class="main_item_bottom_border" v-if="formattedData.length">
        <span>到底啦</span>
      </div>
      <div class="main_item_no_data" v-else="formattedData.length">
        暂无数据
      </div>
    </main>
    <main v-else-if="type === 'option'">
      <div class="main_option">
        <el-radio-group v-model="mainOptionRadio">
          <el-radio-button
            v-for="key in mainOptionRadioList"
            :label="key"
            :value="key"
          />
        </el-radio-group>
      </div>
      <div class="main_content">
        <el-table
          :data="mainOptionRadio && tableData ? tableData[mainOptionRadio] : []"
          style="width: 100%"
          height="100%"
          :border="true"
          show-overflow-tooltip
          @row-click="tableRowClick"
        >
          <el-table-column
            width="50"
            type="index"
            fixed="left"
            align="center"
            :index="indexMethod"
          ></el-table-column>
          <el-table-column
            v-for="(
              { prop, label, width, fixed, minWidth }, index
            ) in mainOptionTableColumn"
            :key="`el-table-column_${index}`"
            :prop="prop"
            :label="label"
            :width="width || ''"
            :min-width="minWidth || ''"
            :fixed="fixed || false"
          >
            <template #default="{ row }">
              <div class="el_role_box" v-if="prop === 'name'">
                <el-image
                  referrerPolicy="no-referrer"
                  :src="row.imgUrl"
                  fit="cover"
                >
                  <template #error>
                    <div class="image-slot">
                      <el-icon><Picture /></el-icon>
                    </div>
                  </template>
                </el-image>
                {{ getTableItem(row, prop) }}
              </div>
              <div
                class="el_position_counters_box"
                v-else-if="prop === 'positionCounters'"
              >
                <el-image
                  referrerPolicy="no-referrer"
                  :src="imgUrl"
                  fit="cover"
                  v-for="imgUrl in getTableItem(row, prop, 'img_urlList') || []"
                  :key="imgUrl"
                >
                  <template #error>
                    <div class="image-slot">
                      <el-icon><Picture /></el-icon>
                    </div>
                  </template>
                </el-image>
              </div>
              <div v-else>
                {{ getTableItem(row, prop, "percentage") }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRaw, watch, ref } from "vue";
const props = defineProps([
  "label",
  "imgIcon",
  "imgUrl",
  "data",
  "updateTime",
  "name",
  "type",
  "openUrl",
  "formatDataFun",
]);
let mainOptionRadio = ref("");
let mainOptionRadioList: string[] = reactive([]);
let mainOptionTableColumn: { [key: string]: any }[] = reactive([]);
let tableData: { [key: string]: object } = reactive({});

let formattedData: { [key: string]: any } = reactive([]);

// includesList
let includesListFun = (type?: string) => {
  if (type === "option") {
    return true;
  } else {
    return ["BLBLHot", "zhihuHot"].includes(props.name);
  }
};

watch(
  () => props.data,
  (newValue) => {
    // 格式化数据
    let data = toRaw(newValue);
    if (includesListFun()) {
      let list = props.formatDataFun(data);
      formattedData.length = 0;
      formattedData.push(...list);
    } else if (includesListFun(props.type)) {
      let { key, obj, column } = props.formatDataFun(data);
      mainOptionRadioList.length = 0;
      mainOptionRadioList.push(...key);
      mainOptionRadio.value = key[0];
      mainOptionTableColumn.length = 0;
      mainOptionTableColumn.push(...column);
      Object.assign(tableData, obj);
    }
  },
  {
    deep: true,
    immediate: true,
  }
);

// 处理表格数据
let getTableItem = (
  row: { [key: string]: number },
  key: string,
  type?: string
) => {
  let data = toRaw(row)[key];
  if (type === "img_urlList") {
    let list: string[] = [];
    if (Array.isArray(data)) {
      data.forEach(({ img_url }) => {
        list.push(img_url);
      });
    }
    return list;
  } else if (type === "percentage") {
    return (data * 100).toFixed(2) + "%";
  } else {
    return data;
  }
};
// 表格索引值
let indexMethod = (index: number) => {
  return index + 1;
};
// 某一行表格点击事件
let tableRowClick = (row: any) => {
  let key = toRaw(row?.key)
  console.log('--- 某一行表格点击事件 ---', key);
  window.open(`${props.openUrl}${key}/build/${mainOptionRadio.value}`, "_blank");
}

// 跳转第三方页面
let visitExternalPage = (id: string) => {
  if (includesListFun()) {
    window.open(`${props.openUrl}${id}` || "" + id, "_blank");
  }
};
</script>

<style src="./less/hotListBox.less" lang="less"></style>
