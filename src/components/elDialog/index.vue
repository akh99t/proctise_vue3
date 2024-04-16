<template>
  <el-dialog
    v-model="dialogVisible"
    :show-close="false"
    :close-on-click-modal="false"
    :align-center="alignCenter || false"
    :width="width || null"
    @close="closeFun ? closeFun : null"
  >
    <main>
      <slot name="main"></slot>
    </main>

    <template #footer>
      <div class="dialog_footer">
        <slot name="footer"></slot>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
let dialogVisible = ref(false);
defineProps(["closeFun", "alignCenter", "width"]);

defineExpose({ dialogVisible });
</script>

<style scoped lang="less">
main {
  padding: 0 10px;
}
.dialog_footer {
  padding: 0 10px;
}
</style>
