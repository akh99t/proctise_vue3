<template>
  <div class="crawler_hot_box">
    <div
      class="hot_item"
      v-for="{ label, imgIcon, data, name, openUrl, formatDataFun } in hotList"
      :key="`hot_item_key: ${label}`"
    >
      <hotListBox
        :label="label"
        :imgIcon="imgIcon"
        :data="data"
        :name="name"
        :openUrl="openUrl"
        :formatDataFun="formatDataFun"
      ></hotListBox>
    </div>
    <div class="hot_item">
      <hotListBox></hotListBox>
    </div>
  </div>
</template>

<script setup lang="ts">
import hotListBox from "./hotListBox.vue";
import { HOT_LIST } from "./hotConfig.ts";
import { axiosFun } from "@/plugins/axiosFun";
import { reactive } from "vue";

const hotList: { [key: string]: string | object }[] = reactive([]);

// 获取热点信息
let getHotData = async () => {
  let promiseList = HOT_LIST.map((item) => {
    return new Promise(async (resolve, reject) => {
      let { code, data } = await axiosFun(item.url, "post", {
        name: item.name,
      });
      if (code === 200) {
        resolve({
          data,
          ...item,
        });
      } else {
        reject();
      }
    });
  });
  let PromiseAllFun = Promise.all(promiseList);
  PromiseAllFun.then((list: any) => {
    hotList.length = 0;
    hotList.push(...list);
  }).catch(() => {});
};

getHotData();
</script>

<style scoped lang="less">
.crawler_hot_box {
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  overflow-y: auto;
  background-color: #e9e9eb;
  padding: 5px;
  box-sizing: border-box;
  .hot_item {
    width: 50%;
    max-width: 700px;
    min-width: 500px;
    height: 50%;
    // padding: 10px 10px 0 10px;
    padding: 5px;
    box-sizing: border-box;
  }
  .hot_item:last-child {
    flex-grow: 1;
    max-width: 100%;
    // padding: 10px 10px 0 10px;
  }
}
</style>
