<template>
  <div
    class="overlay_box gradient-animation"
    :class="{'overlay_box_err': elementLoadingTextErr}"
    v-if="showValidateBox"
    v-loading="loading"
    :element-loading-text="elementLoadingTextErr || elementLoadingText || '验证通过, 连接中...'"
    :key="loading_key"
  >
    <div class="content" :class="{ content_unlock: unlock }">
      <el-icon>
        <Lock v-if="!unlock" />
        <Unlock v-else />
      </el-icon>
      <div class="input_box">
        <el-input
          v-model="invitationCode"
          style="width: 120px"
          :maxlength="maxlength"
          show-word-limit
          placeholder="邀请码"
        />
      </div>
      <el-button type="info" @click="qualifyValidation">确定</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import { axiosFun } from "@/plugins/axiosFun";
import { checkUserCredentials } from "@/plugins/checkUserCredentials";
import { ElMessage } from "element-plus";
import router from "../../router/index";


const props = defineProps(["url", "verifyCodeFun", "elementLoadingText"]);

let elementLoadingTextErr = ref('')
let loadingTextColor = ref('red')
let loading_key = ref(999)

let invitationCode = ref("");
let maxlength = 6;
let showValidateBox = ref(true);
let loading = ref(false);
let unlock = ref(false);


// 校验验证码
let qualifyValidation = async () => {
  if (!invitationCode.value || invitationCode.value.length < maxlength) {
    ElMessage.warning("请输入邀请码");
  } else {
    let userVoucher = await checkUserCredentials();
    if (userVoucher && userVoucher._id) {
      let { code } = await axiosFun(props.url, "post", {
        invitationCode: invitationCode.value,
        userID: userVoucher._id,
      });
      if (code === 200) {
        try {
          loading.value = true;
          let { init } = props.verifyCodeFun || {};
          if ( init instanceof Function) {
            init()
              .then(() => {
                unlock.value = true;
                loading.value = false;
                nextTick(() => {
                  setTimeout(() => {
                    showValidateBox.value = false;
                  }, 1000);
                });
              })
              .catch(() => {
                ElMessage.warning("出错了, 请稍后刷新后再试或找网管!");
                elementLoadingTextErr.value = '出现未知错误, 请稍后再试!'
                loadingTextColor.value = '#F56C6C'
                loading_key.value++
              });
          }
        } catch (error) {
          ElMessage.error("出现意外情况, 请找网管~");
        }
      } else {
        ElMessage.warning("邀请码有误, 不知道就找网管~");
      }
    } else {
      router.push({ path: "/loggedIn" });
    }
  }
};
</script>

<style scoped lang="less">
.gradient-animation {
  background: linear-gradient(
    to bottom right,
    rgba(115, 118, 122, 0.7),
    rgba(144, 147, 153, 0.5),
    rgba(244, 244, 245, 0.3)
  );
  background-size: 100% 2000%;
  animation: moveGradient 4s linear infinite;
}
@keyframes moveGradient {
  0% {
    background-position: top left;
  }
  50% {
    background-position: bottom right;
  }
  100% {
    background-position: top left;
  }
}

.overlay_box {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #ffffff86;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  .content {
    color: #73767a;
    text-align: center;
    .el-icon {
      font-size: 200px;
    }
    .input_box {
      font-size: 14px;
      margin-bottom: 10px;
    }
  }
  .content_unlock {
    .el-icon {
      color: #f4f4f5;
    }
    .input_box,
    .el-button {
      visibility: hidden;
    }
  }
}
</style>

<style lang="less">
@loadingTextColor: #67C23A;
@loadingTextColorErr: #F56C6C;
.overlay_box {
  .el-loading-mask {
    .el-loading-text {
      color: @loadingTextColor !important;
    }
    .circular {
      .path {
        stroke: @loadingTextColor !important;
      }
    }
  }
}
.overlay_box_err {
  .el-loading-mask {
    .el-loading-text {
      color: @loadingTextColorErr !important;
    }
    .circular {
      .path {
        stroke: @loadingTextColorErr !important;
      }
    }
  }
}
</style>
