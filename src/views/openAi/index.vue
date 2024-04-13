<template>
  <div class="open_ai_interface">
    <div class="item_box chat_box">
      <chatBox ref="chatBoxRef"></chatBox>
    </div>
    <div class="item_box configure_box">
      <configureBox :verifyCodeFun="chatBoxRef"></configureBox>
    </div>

    <verifyCodeInput
      url="/openAI/qualifyValidation"
      :verifyCodeFun="chatBoxRef"
      elementLoadingText="验证通过, 连接API中..."
    ></verifyCodeInput>
  </div>
</template>

<script setup lang="ts">
import chatBox from "./chatBox.vue";
import configureBox from "./configureBox.vue";
import verifyCodeInput from "@/components/verifyCodeInput/index.vue";
import { ref } from "vue";

let chatBoxRef = ref();
</script>

<style scoped lang="less">
@configureBoxWidth: 550px;
.open_ai_interface {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  position: relative;
  .item_box {
    border-radius: 10px;
    height: 100%;
    background-color: #dedfe0;
    overflow: hidden;
  }
  .chat_box {
    width: calc(100% - @configureBoxWidth - 10px);
    margin-right: 10px;
  }
  .configure_box {
    width: @configureBoxWidth;
  }
}
</style>
