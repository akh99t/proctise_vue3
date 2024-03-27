<template>
  <div class="app_box" v-if="!fullscreen">
    <el-container>
      <el-header
        >顶部标题栏
        <span>浏览器: {{ getBrowserInfo() }}</span>
      </el-header>
      <el-container>
        <el-aside>
          <NavigationBar></NavigationBar>
        </el-aside>
        <el-main>
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </div>
  <RouterView v-else />
</template>

<script setup lang="ts">
import NavigationBar from "./views/NavigationBar/index.vue";
import { ref, watch } from "vue";
import { RouterView, useRoute } from "vue-router";
import { getBrowserInfo } from "./plugins/browserInfo";
const route = useRoute();

// 判断是否组件全屏
let fullscreen = ref(true);

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
