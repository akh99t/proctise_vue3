<template>
  <div class="option_item">
    <div class="title">
      <slot name="title"></slot>:
    </div>
    <div class="content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="less">
@titleWidth: 50px;
.option_item {
  display: flex;
  margin-bottom: 10px;
  .title {
    width: @titleWidth;
    padding-right: 5px;
    text-align: right;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .content {
    background-color: #ccc;
    width: calc(100% - @titleWidth);
    border-radius: 10px;
    padding: 10px 0;
  }
}
</style>