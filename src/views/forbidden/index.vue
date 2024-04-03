<template>
  <div class="forbidden_box">
    <header>
      <div class="container">
        <div class="container_item" v-for="item in itemLength" :key="item">
          <div></div>
        </div>
      </div>
      <div class="border_box"></div>
      <div class="border_box border_box_bottom"></div>
    </header>
    <main>
      <div class="warn_box">
        <i>
          <el-icon><Hide /></el-icon>
        </i><br />
        Forbidden 403<br />
        禁止访问 <span>[{{ toName }}]</span><br />
      </div>
    </main>
    <footer>
      <div class="container">
        <div class="container_item" v-for="item in itemLength" :key="item">
          <div></div>
        </div>
      </div>
      <div class="border_box"></div>
      <div class="border_box border_box_bottom"></div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, watch } from "vue";
import { useRoute } from 'vue-router';
const route = useRoute();
const { toName } = route.query;

let itemLength = ref(30);
const appBoxWidth: any = inject("appBoxWidth");

watch(
  () => appBoxWidth,
  (newValue) => {
    let value = newValue.value;
    if (value) {
      itemLength.value = Math.ceil((value - 200) / 70) + 3;
    }
  },
  {
    deep: true,
  }
);
</script>

<style scoped src="./index.less" lang="less"></style>
