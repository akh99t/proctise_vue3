<template>
  <div class="batch_process_main">
    <div class="content_box">
      由于浏览器的安全性限制，JavaScript 不能直接访问本地文件系统
      nodejs可以实现, web端无法实现, 解: 该功能无法实现
    </div>
    <div class="content_box">
      
    </div>
  </div>
</template>

<script setup lang="ts">

let handleFileChange = (event:any) => {
  const file = event.target.files[0];
      if (file) {
        console.log('file', file);
        
      }
}
</script>

<style scoped lang="less">
.batch_process_main {
  height: 100%;
  display: flex;
  justify-content: space-between;
  .content_box {
    width: calc(50% - 5px);
    height: 100%;
    background-color: pink;
  }
}
</style>
