<template>
  <div class="configuration_guide_item">
    <shareBoxFlex lableWidth="100px">
      <template v-slot:label>
        <div>体验完整功能</div>
      </template>
      <template #conter>
        <div class="configuration_guide_item_content">
          <el-link
            :underline="false"
            type="primary"
            href="https://chat.openai.com"
            target="_blank"
            >ChatGPT_3.5</el-link
          >
        </div>
      </template>
    </shareBoxFlex>
  </div>
  <div class="configuration_guide_item">
    <shareBoxFlex lableWidth="100px">
      <template v-slot:label>
        <div>了解更多内容</div>
      </template>
      <template #conter>
        <div class="configuration_guide_item_content">
          <el-link
            :underline="false"
            type="primary"
            href="https://openai.com"
            target="_blank"
            >OpenAI</el-link
          >
        </div>
      </template>
    </shareBoxFlex>
  </div>
  <div class="configuration_guide_item">
    <shareBoxFlex lableWidth="100px">
      <template v-slot:label>
        <div>每日访问次数</div>
      </template>
      <template #conter>
        <div class="configuration_guide_item_content">
          {{ fetchQALimitAndAvailability.todayCount }} /
          {{ fetchQALimitAndAvailability.dialogueLimit }}
          <div style="color: #e6a23c" v-if="isLimitExceeded()">
            当前用户今日访问次数用尽!
          </div>
        </div>
      </template>
    </shareBoxFlex>
  </div>
</template>

<script setup lang="ts">
import mitt from "@/plugins/mitt";
import { ref, onUnmounted, reactive } from "vue";
import shareBoxFlex from "@/components/shareBox/shareBoxFlex.vue";

const fetchQALimitAndAvailability = ref({
  dialogueLimit: 0,
  todayCount: 0,
});

let isLimitExceeded = () => {
  return (
    fetchQALimitAndAvailability.value.todayCount ===
    fetchQALimitAndAvailability.value.dialogueLimit
  );
};

// 配置的参数
let fetchQALimitAndAvailabilityFun = (data: any) => {
  Object.assign(fetchQALimitAndAvailability.value, data);
}
let mittGet = mitt.all.get('fetchQALimitAndAvailability')
if (mittGet && mittGet.length) {
  // 已经添加了事件监听器
} else {
  mitt.on("fetchQALimitAndAvailability", fetchQALimitAndAvailabilityFun);
}

onUnmounted(() => {
  // mitt.all.clear();
  mitt.off('fetchQALimitAndAvailability', fetchQALimitAndAvailabilityFun);
});
</script>

<style scoped lang="less">
.configuration_guide_item {
  width: 100%;
  padding: 10px 0;
  .configuration_guide_item_content {
    padding: 0 10px;
    display: flex;
    align-items: center;
    // flex-wrap: wrap;
    div {
      width: auto;
      font-size: 12px;
      padding-left: 10px;
    }
  }
}
</style>
