<template>
  <div class="app_box" ref="appBoxRef">
    <el-container v-if="!fullscreen">
      <el-header
        >这是顶部标题栏
        <span>浏览器: {{ getBrowserInfo() }} | [ 粤ICP备2024229783号 ]</span>
      </el-header>
      <el-container>
        <el-aside>
          <NavigationBar></NavigationBar>
        </el-aside>
        <el-main ref="elMainRef">
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
    <RouterView v-else />
  </div>
</template>

<script setup lang="ts">
import NavigationBar from "./views/NavigationBar/index.vue";
import { ref, watch, watchEffect, provide } from 'vue';
import { RouterView, useRoute } from "vue-router";
import { getBrowserInfo } from "./plugins/browserInfo";

const route = useRoute();
let appBoxRef = ref<HTMLElement | null>();
let appBoxWidth = ref(0);
let fullscreen = ref(true); // 判断是否组件全屏

watchEffect(() => {
  if (appBoxRef.value) {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        appBoxWidth.value = entry.contentRect.width;
      }
    });
    observer.observe(appBoxRef.value);
  }
});

provide('appBoxWidth', appBoxWidth)

watch(
  () => route,
  (newRoute) => {
    // 监听路由, 是否让组件全屏展示
    let { path } = newRoute;
    if (["/loggedIn"].includes(path)) {
      fullscreen.value = true;
    } else {
      fullscreen.value = false;
    }
  },
  {
    deep: true,
  }
);
</script>
<style src="./assets/APP.less" lang="less"></style>
