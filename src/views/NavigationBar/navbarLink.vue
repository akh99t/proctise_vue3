<template>
  <div class="navbar_link">
    <div class="navbar_link_item" v-for="item in routesList" :key="item.path">
      <router-link
        :class="{ item_on: currentRoute === item.path }"
        :to="item.path"
        >{{ item.name }}</router-link
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import router from "@/router";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

let currentRoute = ref("/");

let filterRoutesList = () => {
  return router.getRoutes().filter((item) => {
    return !["/loggedIn", "/"].includes(item.path);
  });
};
let routesList = filterRoutesList();

const route = useRoute();
let getCurrentRoute = () => {
  let { path } = route;
  currentRoute.value = path;
};
getCurrentRoute();
watch(
  () => route,
  () => {
    getCurrentRoute();
  },
  {
    deep: true,
  }
);
</script>

<style scoped lang="less">
.navbar_link {
  width: 100%;
  height: 100%;
  .navbar_link_item {
    text-align: left;
    padding: 15px 10px;
    border-bottom: 1px solid #909399;
    a {
      color: #c0c4cc;
      text-decoration: none;
      font-size: 14px;
      padding: 5px 10px;
      border-radius: 5px;
    }
    .item_on {
      color: #fff;
      background-color: #909399;
    }
  }
  .navbar_link_item:last-child {
    border-bottom: none;
  }
}
</style>
