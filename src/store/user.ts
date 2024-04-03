import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    // 管理员账号
    ADMIN_ACCOUNT: ["admin"],
  }),
});
