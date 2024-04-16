<!-- 批量处理文件夹中的内容 -->
<template>
  <div class="batch_process_box">
    <main>
      <batchProcessMain></batchProcessMain>
    </main>
    <footer>
      <el-button type="primary">Primary</el-button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import batchProcessMain from "./batchProcessMain.vue";
</script>

<style scoped lang="less">
@footerHeight: 50px;
.batch_process_box {
  height: 100%;
  main {
    height: calc(100% - @footerHeight - 10px);
    margin-bottom: 10px;
  }
  footer {
    height: @footerHeight;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 10px;
    background-color: #ccc;
  }
}
</style>
