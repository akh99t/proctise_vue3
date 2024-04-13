<template>
  <div class="navigation_bar">
    <div class="navigation_bar_content">
      <!-- 导航栏 -->
      <navbarLink></navbarLink>
    </div>
    <div class="user_bar">
      <!-- 头像 -->
      <div class="side_box">
        <el-avatar :icon="UserFilled" size="small" />
      </div>
      <!-- 标签 -->
      <div class="tag" :class="{ tag_admin: user.grade === 0 }">
        {{ userGradeList[user.grade] }}
      </div>
      <!-- 用户名 -->
      <el-tooltip effect="dark" :content="user.user" placement="top">
        <div class="user_name">
          {{ user.user }}
        </div>
      </el-tooltip>
      <!-- 退出登录 -->
      <div class="side_box logout">
        <el-button key="info" type="info" link @click="logoutFun">
          <el-icon><CircleCloseFilled /></el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from "@/router";
import navbarLink from "./navbarLink.vue";
import { UserFilled } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { onMounted, onUnmounted, reactive } from "vue";

const userGradeList: { [key: number]: string } = {
  0: "管理",
  1: "用户",
};

const user = reactive({
  user: "--",
  grade: 1,
});

let getUserData = () => {
  let data = localStorage.getItem("user");
  let userData = JSON.parse(data || "");
  if (userData) {
    Object.assign(user, userData.session || {});
  }
};

getUserData();

let logoutFun = () => {
  ElMessageBox.confirm("是否退出登录?", "通知", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  }).then(() => {
    localStorage.removeItem("user");
    setTimeout(() => {
      router.push({ path: "/loggedIn" });
      ElMessage.success(`退出登录成功!`);
    }, 500);
  });
};

onMounted(() => {
  // window 对象 storage 事件，是 localStorage 和 sessionStorage 的 Web Storage API
  window.addEventListener("storage", getUserData);
});

onUnmounted(() => {
  window.removeEventListener("storage", getUserData);
});
</script>

<style scoped lang="less">
@userBarHeight: 40px;
.navigation_bar {
  width: 100%;
  height: 100%;
  .navigation_bar_content {
    height: calc(100% - @userBarHeight);
    overflow: hidden;
    overflow-y: auto;
  }
  .user_bar {
    width: 100%;
    height: @userBarHeight;
    background-color: #c0c4cc;
    display: flex;
    justify-content: space-between;
    position: relative;
    .side_box {
      width: @userBarHeight;
      height: @userBarHeight;
      padding: 5px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .user_name {
      line-height: @userBarHeight;
      width: calc(100% - @userBarHeight * 2);
      text-align: left;
      padding: 0 12px;
      box-sizing: border-box;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: default;
    }
    .tag {
      position: absolute;
      display: inline-block;
      font-size: 10px;
      color: #fff;
      border-radius: 5px;
      background-color: #67c23a;
      padding: 2px 4px;
      border-radius: 4px;
      left: 24px;
      bottom: 2px;
    }
    .tag_admin {
      background-color: #f56c6c;
    }
  }
}
</style>
