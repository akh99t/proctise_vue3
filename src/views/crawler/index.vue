<template>
  <div class="crawler_hot_box" v-loading="loading">
    <div
      class="hot_item"
      v-for="{
        label,
        imgIcon,
        imgUrl,
        data,
        updateTime,
        name,
        openUrl,
        formatDataFun,
        type,
      } in hotList"
      :key="`hot_item_key: ${label}`"
    >
      <hotListBox
        :label="label"
        :imgIcon="imgIcon"
        :imgUrl="imgUrl"
        :data="data"
        :name="name"
        :type="type"
        :openUrl="openUrl"
        :updateTime="updateTime"
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
import { HOT_LIST } from "./hotConfig";
import { axiosFun } from "@/plugins/axiosFun";
import { reactive, ref, nextTick } from "vue";
import moment from "moment";

let loading = ref(false);
const hotList: { [key: string]: string | object }[] = reactive([]);

// 获取热点信息
let getHotData = async () => {
  loading.value = true;
  let promiseList = HOT_LIST.map((item) => {
    return new Promise(async (resolve, reject) => {
      let { code, data, updateTime } = await axiosFun(item.url, "post", {
        name: item.name,
      });
      if (code === 200 ) {
        if (item.type === 'option' && typeof data === 'object' && !Array.isArray(data)) {
          resolve({
            data,
            updateTime: moment(updateTime).format("HH:mm"),
            ...item,
          });
        } else if ( Array.isArray(data)) {
          resolve({
            data: data.length > 99 ? data : data.slice(0, 99),
            updateTime: moment(updateTime).format("HH:mm"),
            ...item,
          });
        }
      } else {
        reject();
      }
    });
  });
  let PromiseAllFun = Promise.all(promiseList);
  PromiseAllFun.then((list: any) => {
    hotList.length = 0;
    hotList.push(...list);
    nextTick(() => {
      loading.value = false;
    });
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
