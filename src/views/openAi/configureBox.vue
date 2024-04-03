<template>
  <div class="configure">
    <header>配置</header>
    <main>
      <div class="configure_item_box">
        <div class="title">关于...</div>
        <configurationGuide></configurationGuide>
      </div>
      <div class="configure_item_box">
        <div class="title">参数设置</div>
        <shareBoxFlex
          lableWidth="100px"
          v-for="item in cloneConfiguration"
          :key="item.key"
        >
          <template v-slot:label>
            <div class="label_box">
              <div class="icon_box" v-if="item.cue">
                <el-popover
                  placement="left"
                  :width="300"
                  trigger="hover"
                  :content="item.cue"
                >
                  <template #reference>
                    <el-icon><QuestionFilled /></el-icon>
                  </template>
                </el-popover>
              </div>
              {{ item.label }}
            </div>
          </template>
          <template #conter>
            <fillData
              v-model="item.value"
              :data="item.data"
              :type="item.type"
            ></fillData>
          </template>
        </shareBoxFlex>
      </div>
    </main>
    <footer>
      <el-button @click="exportDialog">导出</el-button>
      <el-button type="primary" @click="updateConfigurationFun">应用</el-button>
    </footer>

    <el-dialog
      v-model="dialogVisible"
      width="50%"
      top="25vh"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div class="dialog_box">
        <div
          class="dialog_box_item"
          v-for="{ value, label } in exportList"
          :key="value"
          :class="{ dialog_box_item_on: exportType === value }"
          @click="exportItemClick(value)"
        >
          <el-icon>
            <ChatLineSquare v-if="value === 'chatRecords'" />
            <Operation v-else />
          </el-icon>
          <div>{{ label }}</div>
        </div>
      </div>
      <template #footer>
        <div class="dialog_footer">
          <el-button size="default" @click="exportDialog(false)"
            >关闭</el-button
          >
          <el-button size="default" type="primary" @click="exportDataFun"
            >导出</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import shareBoxFlex from "@/components/shareBox/shareBoxFlex.vue";
import configurationGuide from "./configurationGuide.vue";
import fillData from "./fillData.vue";
import { reactive, onMounted, toRaw, onUnmounted, ref, nextTick } from 'vue';
import { axiosFun } from "@/plugins/axiosFun";
import { configuration } from "./configure";
import { ElMessage } from "element-plus";
import mitt from "@/plugins/mitt";
import moment from "moment";

const props = defineProps(["verifyCodeFun"]);

let cloneConfiguration = reactive(configuration);
let dialogVisible = ref(false);
let exportType = ref("configurations");
let exportList = [
  {
    label: "聊天记录",
    value: "chatRecords",
  },
  {
    label: "配置项",
    value: "configurations",
  },
];

// 传递配置参数
let updateConfigurationFun = (
  type: string = ""
): { [key: string]: any } | null => {
  let list = toRaw(cloneConfiguration) || [];
  let obj: { [key: string]: number | string } = {};
  list.forEach(({ value, key }) => {
    obj[key] = value;
  });
  if (type === "export") {
    return obj;
  } else {
    nextTick(() => {
      mitt.emit("updateConfiguration", obj);
    })
    return null;
  }
};

// 弹出框-导出
let exportDialog = (bool: boolean = true) => {
  dialogVisible.value = bool;
};
let exportItemClick = (item: string) => {
  exportType.value = item;
};
// 导出数据
let exportDataFun = async () => {
  let type = exportType.value;
  if (type === "configurations") {
    // 导出配置项
    let data = updateConfigurationFun("export");
    if (data && typeof data === "object") {
      exportFillFun(data, "AI对话配置项");
    }
  } else if (type === "chatRecords") {
    // 导出聊天记录
    let { parameter } = props.verifyCodeFun || {};
    let { userName } = parameter || {};
    let { code, data, message } = await axiosFun(
      "/openAI/getAIDialogueRecords",
      "post",
      { userName }
    );
    if (code === 200 && Array.isArray(data)) {
      if (data.length) {
        let conversationList: { [key: string]: any }[] = [];
        data.forEach(({ userID, date, dataJSON }) => {
          let { Q, A } = JSON.parse(dataJSON) || {};
          let AList = [];
          if (Array.isArray(A)) {
            AList.push(
              ...A.map(({ message }) => {
                return message?.content || "";
              })
            );
          }
          let obj = {
            userName,
            userID,
            date: moment.utc(date).format("YYYY-MM-DD HH:mm:ss"),
            "Q&A": {
              Q,
              A: AList,
            },
          };
          conversationList.push(obj);
        });
        exportFillFun(conversationList, `${userName}_[${moment(new Date()).format("YY/MM/DD")}]_记录`);
      } else {
        ElMessage.warning('当前对话记录: 0');
      }
    } else {
      ElMessage.warning(message);
    }
  } else {
  }

  exportDialog(false);
};

// 导出文件
let exportFillFun = (data: object, filename: string) => {
  let jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename + ".txt";
  a.click();
  // 释放 Blob URL
  URL.revokeObjectURL(url);
};

onMounted(() => {
  updateConfigurationFun();
});
</script>

<style scoped lang="less">
@sidebarHeight: 45px;
.configure {
  width: 100%;
  height: 100%;
  header,
  footer {
    height: @sidebarHeight;
    background-color: #b1b3b8;
    line-height: @sidebarHeight;
    box-sizing: border-box;
    padding: 0 10px;
    color: #fff;
    text-align: center;
  }
  footer {
    text-align: right;
    line-height: calc(@sidebarHeight - 2px);
  }
  main {
    height: calc(100% - (@sidebarHeight * 2));
    box-sizing: border-box;
    padding: 10px;
    .configure_item_box {
      width: 100%;
      height: 50%;
      overflow: hidden;
      overflow-y: auto;
      .title {
        text-align: center;
        border-bottom: 1px solid #fff;
        padding: 0 0 10px;
        margin-bottom: 10px;
      }
      .label_box {
        width: 100%;
        display: flex;
        justify-content: end;
        .icon_box {
          display: flex;
          align-items: center;
          padding-right: 5px;
          color: #73767a;
        }
      }
    }
  }
}
.dialog_box {
  width: 100%;
  display: flex;
  padding: 0 10px;
  justify-content: center;
  box-sizing: border-box;
  .dialog_box_item {
    width: 120px;
    border-radius: 10px;
    border: 1px solid #73767a;
    padding: 30px 0;
    font-size: 50px;
    text-align: center;
    margin: 0 30px;
    cursor: pointer;
    div {
      width: 100%;
      font-size: 16px;
      line-height: 30px;
    }
  }
  .dialog_box_item_on {
    color: #409eff;
    border-color: #409eff;
  }
}
.dialog_footer {
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
}
</style>
