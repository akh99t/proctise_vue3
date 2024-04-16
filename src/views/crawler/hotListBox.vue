<template>
  <div class="hot_list_box">
    <div class="title_box">
      <div class="title_item image_box" v-html="imgIcon"></div>
      {{ label || "--" }}
      <div class="title_item update_time">{{ updateTime ? `update: ${updateTime}` : '--'}}</div>
    </div>
    <div class="hr_box"></div>
    <main>
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
              
              <span> views: <span>{{ item.view }}</span> </span>
              <span> comments: <span>{{ item.reply }}</span> </span>
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
  </div>
</template>

<script setup lang="ts">
import { reactive, toRaw, watch } from "vue";
const props = defineProps([
  "label",
  "imgIcon",
  "data",
  "updateTime",
  "name",
  "openUrl",
  "formatDataFun",
]);

let formattedData: { [key: string]: any }[] = reactive([]);

// includesList
let includesListFun = () => {
  return ["BLBLHot", "zhihuHot"].includes(props.name);
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
    } else {
    }
  },
  {
    deep: true,
    immediate: true,
  }
);

// 跳转第三方页面
let visitExternalPage = (id: string) => {
  if (includesListFun()) {
    window.open(`${props.openUrl}${id}` || "" + id, "_blank");
  }
};
</script>

<style src="./less/hotListBox.less" lang="less"></style>
