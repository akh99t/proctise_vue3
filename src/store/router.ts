import { defineStore } from "pinia";

export const userRouterStore = defineStore("router", {
  state: () => ({
    // 禁止展示的路由
    FILTER_ROUTES: ["/", "/loggedIn", "/forbidden"],
    // 最高权限路由
    HIGHEST_AUTH_ROUTE: ["/InterfaceLog", "/usersManagement"],
  }),
});
