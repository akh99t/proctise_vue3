<template>
  <div class="login_interface">
    <!-- 登录窗口 -->
    <div class="center_box">
      <div class="item">
        <div class="label_box">用户:</div>
        <div class="value_box">
          <el-input
            v-model="user"
            placeholder="这里填账号!"
            maxlength="10"
            show-word-limit
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
            maxlength="10"
            show-word-limit
            @keypress="handleKeyPress"
            @keyup.enter="() => handleEnterEnter('password')"
            show-password
          />
        </div>
      </div>

      <div class="switch_box">
        <el-button
          style="width: 120px"
          @click="guestLogin"
          :disabled="btnDisabled"
          >访客登录</el-button
        >
        <el-button
          style="width: 120px"
          type="primary"
          @click="loginFun"
          :disabled="btnDisabled"
          >登录</el-button
        >
      </div>
    </div>
    <!-- 底部装饰物动画 -->
    <div class="ornaments_bottom">
      <div class="mario_box">
        <div class="mario_translation_box" ref="marioTranslationBoxRef">
          <img :src="src" v-for="src in marioSrcList" :key="`img_${src}`" />
        </div>
        <div class="pipeline_box">
          <img src="@/assets/images/马里奥_管道new.png" />
        </div>
      </div>
      <div class="floor_box">
        <div class="translation_box">
          <div
            class="floor_item"
            v-for="item in iconFloorNum"
            :key="`floor_item_${item}`"
          >
            <img src="@/assets/images/马里奥_地砖.png" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MD5 } from "crypto-js";
import { axiosFun, saveUserDataToLocalStorage } from "@/plugins/axiosFun";
import { ref, nextTick, inject, watch } from "vue";
import { ElMessage } from "element-plus";
import router from "@/router";
import marioGif from "@/assets/images/马里奥_走路.gif";

let user = ref("");
let password = ref("");
let btnDisabled = ref(false);
// 外部dom宽度
const appBoxWidth = inject("appBoxWidth");
// icon数量
let iconFloorNum = ref(50);
let marioSrcList = [marioGif, marioGif, marioGif];

let inputPasswordRef = ref();
let marioTranslationBoxRef = ref();

// 登录
let loginFun = async () => {
  btnDisabled.value = true;
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

// 访客登录
let guestLogin = () => {
  btnDisabled.value = true;
  user.value = "访客登录";
  password.value = "999999";
  nextTick(() => {
    setTimeout(() => {
      loginFun();
    }, 1000);
  });
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

nextTick(() => {
  marioTranslationBoxRef.value.classList.add("mario_translation_box_js");
  setTimeout(() => {
    marioTranslationBoxRef.value.classList.remove("mario_translation_box_js");
  }, 500);
});

watch(
  () => appBoxWidth,
  (newVal: any) => {
    let iconNum = Math.ceil(newVal.value / 70) + 1;
    iconFloorNum.value = iconNum;
  },
  { deep: true }
);
</script>

<style scoped src="./index.less" lang="less"></style>
