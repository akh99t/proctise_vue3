<template>
  <div class="share_box">
    <div class="share_box_label">
      <slot name="label"></slot>
    </div>
    <div class="share_box_conter">
      <slot name="conter"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRaw } from "vue";
const props = defineProps(["lableWidth"]);
let { lableWidth } = toRaw(props);

const cssStyleLableWidth = lableWidth || "60px";
</script>

<style scoped lang="less">
@lableWidth: v-bind(cssStyleLableWidth);
.share_box {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 0 15px 0 10px;
  .share_box_label {
    width: @lableWidth;
    text-align: right;
    padding-right: 5px;
    box-sizing: border-box;
    font-size: 12px;
  }
  .share_box_conter {
    width: calc(100% - @lableWidth);
  }
}
.share_box:last-child {
  margin-bottom: 0;
}
</style>
