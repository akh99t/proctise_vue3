<template>
  <div class="app_box">
    <el-container>
      <el-header>这是什么?</el-header>
      <el-container>
        <el-aside>导航栏</el-aside>
        <el-main>
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
</script>
<style src="./assets/APP.less" lang="less"></style>
