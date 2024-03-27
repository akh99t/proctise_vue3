import { createRouter, createWebHistory } from "vue-router";

import batchProcess from "@/views/batchProcess/index.vue";
import configureChair from "@/views/configureChair/index.vue";
import openAi from '@/views/openAi/index.vue'
import loggedIn from "@/views/loggedIn/index.vue";
// 检验用户凭证
import { checkUserCredentials } from "@/plugins/checkUserCredentials";
import { ElMessage } from "element-plus";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: "chatGPT",
      path: "/openAI",
      component: openAi,
    },
    {
      name: "配置图表",
      path: "/configureChair",
      component: configureChair,
    },
    {
      name: "批量处理文件",
      path: "/batchProcess",
      component: batchProcess,
    },
    {
      name: "登录",
      path: "/loggedIn",
      component: loggedIn,
    },
    {
      // 重定向
      path: "/",
      redirect: "/openAI",
    },
  ],
});
router.beforeEach(async (to, from, next) => {
  let checkUserCredentialsData = await checkUserCredentials();
  // 检验用户凭证 - 当本地无用户凭证or用户凭证过期, 则跳转登录界面
  if (to.path !== "/loggedIn") {
    if (!checkUserCredentialsData) {
      ElMessage.warning("请先登录!");
      next({ name: "登录" }); // 重定向
    } else {
      next();
    }
  } else {
    if (checkUserCredentialsData) {
      next({ path: "/" });
    } else {
      next();
    }
  }
});

export default router;
