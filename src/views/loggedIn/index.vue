<template>
  <div class="login_interface">
    <div class="center_box">
      <div class="item">
        <div class="label_box">用户:</div>
        <div class="value_box">
          <el-input
            v-model="user"
            placeholder="这里填账号!"
            @keypress="handleKeyPress"
            @keyup.enter="() => handleEnterEnter('user')"
          />
        </div>
      </div>

      <div class="item">
        <div class="label_box">密码:</div>
        <div class="value_box">
          <el-input
            v-model="password"
            type="password"
            ref="inputPasswordRef"
            placeholder="这里填密码!"
            @keypress="handleKeyPress"
            @keyup.enter="() => handleEnterEnter('password')"
            show-password
          />
        </div>
      </div>

      <div class="switch_box">
        <el-button style="width: 120px" disabled>访客登录</el-button>
        <el-button style="width: 120px" type="primary" @click="loginFun"
          >登录</el-button
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MD5 } from "crypto-js";
import { axiosFun, saveUserDataToLocalStorage } from "@/plugins/axiosFun";
import { ref } from "vue";
import { ElMessage } from "element-plus";
import router from "@/router";

let user = ref("");
let password = ref("");

let inputPasswordRef = ref();

// 登录
let loginFun = async () => {
  if (user.value && password.value) {
    let parameters = {
      userName: user.value,
      password: MD5(password.value).toString(),
    };
    let data = await axiosFun("/login", "post", parameters);

    let { code, message } = data;
    if (code === 200) {
      // 登录/注册成功
      // localStorage保存用户数据
      let userCredentials = await axiosFun(
        "/login/userCredentials",
        "post",
        parameters
      );
      if (
        userCredentials?.code === 200 &&
        typeof userCredentials?.data === "object"
      ) {
        saveUserDataToLocalStorage(userCredentials.data);
        ElMessage.success(`${message}!`);
        router.push({ path: "/" });
      } else {
        ElMessage.warning("登录操作有误, 请刷新重试!");
      }
    } else if (code === 400) {
      ElMessage.warning("请检查账号或密码是否有误!");
    } else {
      ElMessage.error(message);
    }
  } else {
    ElMessage.warning("请输入账号密码!");
  }
};

// 按键事件
let handleKeyPress = (event: any) => {
  // 禁止空格
  let { key, charCode } = event;
  if (charCode === 32) {
    event.preventDefault();
  }
};

// 回车事件
let handleEnterEnter = (type: string = "") => {
  if (type === "user") {
    inputPasswordRef.value.focus();
  } else if (type === "password") {
    loginFun();
  } else {
  }
};
</script>

<style scoped src="./index.less" lang="less"></style>
