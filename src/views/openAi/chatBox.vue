<template>
  <div class="chat">
    <header>
      <span>
        Dialog
        <el-icon v-show="disabled" class="icon_box spinner"
          ><Loading
        /></el-icon>
      </span>
      <div class="user_box">userID: {{ parameter.user || "--" }}</div>
    </header>
    <div class="dialog_box">
      <div class="dialog_box_content" id="dialogBoxContentID">
        <div
          class="item"
          :class="{ item_me: type === 'Q' }"
          v-for="({ type, content }, index) in dialog"
          :key="`dialog_${index}`"
        >
          <div class="item_user">AI</div>
          <div class="item_content" v-html="content"></div>
          <div class="item_user">ME</div>
        </div>
      </div>
    </div>
    <div class="input_box">
      <el-input
        ref="elInputRef"
        v-model="contentText"
        maxlength="100"
        style="height: 100%"
        resize="none"
        show-word-limit
        type="textarea"
        @keyup.enter="sendDataFun"
        :disabled="disabled || isAILimitExhausted"
      />
      <div class="btn">
        <el-button
          style="width: 52px"
          size="small"
          :disabled="disabled || isAILimitExhausted"
          @click="sendDataFun"
        >
          <el-icon v-show="disabled"><Loading /></el-icon>
          <span v-show="!disabled">发送</span>
        </el-button>
      </div>
      <div class="cue" v-show="disabled">等待回应中...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, reactive, nextTick } from "vue";
import {
  thirdPartyTransferAI,
  fetchQALimitAndAvailability,
  uploadConversationData,
} from "./openAI";
import mitt from "@/plugins/mitt";
import { nanoid } from "nanoid";

let contentText = ref("");
let cloneContentText = ref("");
let parameter: { [key: string]: string } = reactive({
  user: "",
  userName: "",
});
let dialog: { [key: string]: any }[] = reactive([]);
let disabled = ref(true);
// AI对话次数用尽
let isAILimitExhausted = ref(false)
let elInputRef = ref();

let init = async () => {
  let data = localStorage.getItem("user") || "";
  let { session } = JSON.parse(data) || {};
  parameter.user = `${session?.user || "???"}_${nanoid(6)}` || "";
  parameter.userName = session?.user || "";

  // 获取今日当前用户的对话次数
  let fetchQALimitAndAvailabilityData = await fetchQALimitAndAvailabilityFun(session?.user || "")
  if (fetchQALimitAndAvailabilityData) {
    return thirdPartyTransferAIFun("你好, 请你介绍一下自己");
  }
};

// 获取AI问答数据
let thirdPartyTransferAIFun = (
  content = "",
  parameter: { [key: string]: any } = {}
) => {
  return new Promise((resolve, reject) => {
    disabled.value = true;
    thirdPartyTransferAI(content, parameter)
      .then((value: any) => {
        if (value instanceof Array && value.length) {
          let obj = {
            type: "A",
            content: "",
          };
          value.forEach((item, index) => {
            let spanStr =
              value.length > 1
                ? `<span style="font-weight: 700;">回复${index + 1}: </span>`
                : "";
            if (item && item.message instanceof Object) {
              let { content, role } = item.message || {};
              if (role === "assistant") {
                obj.content += `<div>${spanStr} ${content}</div>`;
              }
            }
          });
          dialog.push(obj);

          // 存储问答记录
          if (
            cloneContentText.value &&
            parameter?.userName &&
            parameter?.user
          ) {
            uploadConversationData(
              parameter.userName,
              {
                Q: cloneContentText.value,
                A: value,
              },
              parameter.user
            );
          }

          // 获取今日当前用户的对话次数
          if (parameter?.userName) {
            fetchQALimitAndAvailabilityFun(parameter.userName)
          }

          nextTick(() => {
            scrollToBottom("dialogBoxContentID");
            disabled.value = false;
            elInputRef.value?.focus();
            resolve(value);
          });
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// 提问
let sendDataFun = () => {
  if (contentText.value && contentText.value.trim()) {
    cloneContentText.value = contentText.value.trim();
    thirdPartyTransferAIFun(contentText.value, parameter);
    let obj = {
      type: "Q",
      content: contentText.value,
    };
    dialog.push(obj);
    contentText.value = "";
    nextTick(() => {
      scrollToBottom("dialogBoxContentID");
    });
  }
};

// 获取今日当前用户的对话次数
let fetchQALimitAndAvailabilityFun = async (userName:string = "") => {
  let fetchQALimitAndAvailabilityData = await fetchQALimitAndAvailability(
    userName
  );
  
  if (typeof fetchQALimitAndAvailabilityData === "object") {
    let { dialogueLimit, todayCount } = fetchQALimitAndAvailabilityData;
    if ( dialogueLimit === todayCount ) {
      isAILimitExhausted.value = true
    } else {
      isAILimitExhausted.value = false
    }
    mitt.emit("fetchQALimitAndAvailability", fetchQALimitAndAvailabilityData);
    return true;
  } else {
    return false;
  }
};

// 滚动条滚动到底部
function scrollToBottom(id: string) {
  var element = document.getElementById(id);
  if (element) {
    element.scrollTop = element.scrollHeight;
  }
}

// 配置的参数
mitt.on("updateConfiguration", (data) => {
  Object.assign(parameter, data);
});

onUnmounted(() => {
  // mitt.all.clear();
  mitt.off('updateConfiguration');
});

defineExpose({ init, parameter });
</script>

<style scoped lang="less">
@inputBoxHeight: 100px;
@headerHeight: 45px;
@itemUserBoxWidth: 24px;
.chat {
  width: 100%;
  height: 100%;
  header {
    height: @headerHeight;
    text-align: center;
    line-height: @headerHeight;
    color: #fff;
    background-color: #b1b3b8;
    padding: 0 10px;
    position: relative;
    span {
      position: relative;

      .icon_box {
        position: absolute;
        height: 100%;
        top: 0;
        right: -20px;
        font-size: 18px;
      }
    }
    .user_box {
      height: 100%;
      position: absolute;
      right: 10px;
      top: 0;
      font-size: 12px;
    }
  }
  .dialog_box {
    height: calc(100% - @inputBoxHeight - @headerHeight);
    box-sizing: border-box;
    padding: 10px;
    border-bottom: 1px solid #c8c9cc;
    .dialog_box_content {
      height: 100%;
      overflow: hidden;
      overflow-y: auto;
      .item {
        width: 100%;
        display: flex;
        line-height: 24px;
        margin-bottom: 10px;
        .item_user {
          width: @itemUserBoxWidth;
          height: @itemUserBoxWidth;
          background-color: #73767a;
          border-radius: 5px;
          color: #fff;
          text-align: center;
          font-size: 12px;
          margin: 10px;
          margin-left: calc(@itemUserBoxWidth / 2);
          margin-right: calc(@itemUserBoxWidth / 2);
          flex-shrink: 0;
        }
        .item_user:last-child {
          visibility: hidden;
        }
        .item_content {
          width: auto;
          max-width: calc(100% - (@itemUserBoxWidth * 2));
          background-color: #fff;
          border-radius: 10px;
          padding: 10px;
        }
      }
      .item_me {
        justify-content: end;
        .item_user:last-child {
          visibility: visible;
        }
        .item_user:first-child {
          visibility: hidden;
        }
      }
    }
  }
  .input_box {
    height: @inputBoxHeight;
    padding: 10px;
    box-sizing: border-box;
    position: relative;
    .btn {
      position: absolute;
      right: 18px;
      top: calc(50% - 12px);
    }
    .cue {
      position: absolute;
      top: -10px;
      left: 10px;
      color: #73767a;
    }
  }
}

.spinner {
  animation: spin 3s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
<style lang="less">
.chat {
  .dialog_box {
  }
  .input_box {
    .el-textarea__inner {
      padding: 5px 80px 5px 11px;
      height: 100%;
    }
    .el-textarea {
      --el-input-focus-border-color: none !important;
    }
  }
}
</style>
