import { createRouter, createWebHistory } from "vue-router";
import { userRouterStore } from "@/store/router";
import { useUserStore } from "@/store/user";

import batchProcess from "@/views/batchProcess/index.vue";
import configureChair from "@/views/configureChair/index.vue";
import openAi from "@/views/openAi/index.vue";
import loggedIn from "@/views/loggedIn/index.vue";
import iframeWeb from "@/views/iframeWeb/index.vue";
import forbidden from "@/views/forbidden/index.vue";
import InterfaceLog from "@/views/InterfaceLog/index.vue";

// 检验用户凭证
import { checkUserCredentials } from "@/plugins/checkUserCredentials";
import { ElMessage } from "element-plus";
import { toRaw } from "vue";

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
      name: "内嵌第三方",
      path: "/iframe",
      component: iframeWeb,
    },
    {
      name: "接口日志",
      path: "/InterfaceLog",
      component: InterfaceLog,
    },
    {
      name: "禁止访问",
      path: "/forbidden",
      component: forbidden,
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
  const storeRouter = userRouterStore();
  const storeUser = useUserStore();
  let checkUserCredentialsData = await checkUserCredentials();

  // 检验用户凭证 - 当本地无用户凭证or用户凭证过期, 则跳转登录界面
  if (to.path !== "/loggedIn") {
    if (!checkUserCredentialsData) {
      ElMessage.warning("请先登录!");
      next({ name: "登录" });
    } else {
      // 判断当前路由是否需要最高权限, 如无权限禁止访问
      let HIGHEST_AUTH_ROUTE = toRaw(storeRouter.HIGHEST_AUTH_ROUTE) || [];
      let ADMIN_ACCOUNT = toRaw(storeUser.ADMIN_ACCOUNT) || [];
      if (
        HIGHEST_AUTH_ROUTE.includes(to.path) &&
        !ADMIN_ACCOUNT.includes(checkUserCredentialsData?.user)
      ) {
        next({ query: { toName: to.name || '' }, name: "禁止访问" });
      } else {
        next();
      }
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
