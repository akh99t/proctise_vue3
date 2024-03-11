<template>
  <div class="configure_chair_box">
    <div class="flex_item">
      <!-- 展示图表 -->
      <showContent />
    </div>
    <div class="flex_item_configurasion">
      <!-- 配置项 -->
      <configurasion />
    </div>
  </div>
</template>

<script setup lang="ts">
import showContent from "./showContent.vue";
import configurasion from "./configurasion.vue";

</script>

<style scoped lang="less">
@configurasionBoxWidth: 550px;
.configure_chair_box {
  height: 100%;
  display: flex;
  justify-content: space-between;
  .flex_item {
    width: calc(100% - @configurasionBoxWidth - 5px);
  }
  .flex_item_configurasion {
    width: @configurasionBoxWidth;
  }
}
</style>