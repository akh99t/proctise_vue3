<template>
  <div class="container_box">
    <div class="forbidden_box">
      <div class="header_box">
        <header>
          <div class="container">
            <div class="container_item" v-for="item in itemLength" :key="item">
              <div></div>
            </div>
          </div>
          <div class="border_box"></div>
          <div class="border_box border_box_bottom"></div>
        </header>
      </div>
      <main>
        <div class="warn_box">
          <i>
            <el-icon><Hide /></el-icon> </i
          ><br />
          Forbidden 403<br />
          禁止访问 <span>[ {{ toNameRef }} ]</span><br />
        </div>
      </main>
      <div class="footer_box">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, watch } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
let toNameRef = ref("");

let itemLength = ref(30);
const appBoxWidth: any = inject("appBoxWidth");

watch(
  () => appBoxWidth,
  (newValue) => {
    let value = newValue.value;
    if (value) {
      itemLength.value = Math.ceil((value - 200) / 70) + 2;
    }
  },
  {
    deep: true,
    immediate: true,
  }
);

watch(
  () => route.query.toName,
  (newValue) => {
    if (typeof newValue === "string") {
      toNameRef.value = newValue;
    }
  },
  {
    deep: true,
    immediate: true,
  }
);
</script>

<style scoped src="./index.less" lang="less"></style>
