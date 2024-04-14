<template>
  <div class="app_box" ref="appBoxRef">
    <el-container v-if="!fullscreen">
      <el-header>
        <span class="ip">{{
          _IP && _IP_LOCATION ? `${_IP} | ${_IP_LOCATION}` : ""
        }}</span>
        这是顶部标题栏
        <span class="browser"
          >浏览器: {{ getBrowserInfo() }} | [ {{ ICP }} ]</span
        >
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
import { ref, watch, watchEffect, provide, nextTick } from "vue";
import { RouterView, useRoute } from "vue-router";
import { getBrowserInfo } from "./plugins/browserInfo";
import { getIPFun, ICP } from "./constants";

const route = useRoute();
let appBoxRef = ref<HTMLElement | null>();
let appBoxWidth = ref(0);
let fullscreen = ref(true); // 判断是否组件全屏
let _IP = ref("");
let _IP_LOCATION = ref("");

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

provide("appBoxWidth", appBoxWidth);

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

// IP与IP归属地
nextTick(() => {
  getIPFun.then((data: any) => {
    let { IP, IP_LOCATION } = data;
    if (IP && IP_LOCATION) {
      _IP_LOCATION.value = IP_LOCATION;
      _IP.value = IP;
    }
  });
});
</script>
<style src="./assets/APP.less" lang="less"></style>
