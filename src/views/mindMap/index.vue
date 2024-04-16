<template>
  <div class="mind_map_box">
    <div class="navigation_bar_box">
      <div class="navigation_bar_btn_box">
        <div
          v-for="({ label, url }, index) in iframeListClone"
          class="navigation_bar_item"
          :class="{ navigation_bar_item_on: index === iframeItemOn }"
          @click="changeIframeFun(index, url)"
        >
          {{ label }}
        </div>
      </div>
      <div class="navigation_bar_bottom">
        <el-button type="primary" @click="openDialogFun">导入URL</el-button>
        <el-button type="primary" disabled>保存</el-button>
        <el-button type="primary" disabled>校验</el-button>
      </div>
    </div>
    <div class="iframe_box">
      <iframe
        id="embed_dom"
        name="embed_dom"
        frameborder="0"
        style="display: block"
        :src="iframeSrc"
      ></iframe>
    </div>
  </div>

  <elDialog
    ref="elDialogRef"
    :closeFun="dialogCloseFun"
    :alignCenter="true"
    width="500px"
  >
    <template #main>
      <div class="dialog_main_box">
        <div class="input_box">
          <span> 名称 </span>
          <div class="input_box">
            <el-input
              v-model="elDialogLabel"
              show-word-limit
              maxlength="6"
              placeholder="请输入名称"
            />
          </div>
        </div>
        <div class="input_box">
          <span> 网址 </span>
          <div class="input_box">
            <el-input v-model="elDialogUrl" placeholder="请输入可访问的网址" />
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <el-button type="primary" size="mini" @click="dialogCloseFun"
        >关闭</el-button
      >
      <el-button type="primary" size="mini" @click="importIframeData"
        >导入配置</el-button
      >
    </template>
  </elDialog>
</template>

<script setup lang="ts">
import elDialog from "@/components/elDialog/index.vue";
import { WEB_URL } from "@/constants";
import { isValidURL } from "@/plugins/urlFun";
import { ref } from "vue";
import { iframeList } from "./index";
import { ElMessage } from "element-plus";

let iframeListClone = ref(iframeList);
let iframeSrc = ref("");
let iframeItemOn = ref(0);
let elDialogRef = ref();
let elDialogLabel = ref("");
let elDialogUrl = ref("");

let changeIframeFun = (index: number, url: string) => {
  iframeSrc.value = url;
  iframeItemOn.value = index;
};

let openDialogFun = () => {
  elDialogRef.value.dialogVisible = true;
};

let dialogCloseFun = () => {
  elDialogRef.value.dialogVisible = false;
  elDialogUrl.value = "";
  elDialogLabel.value = "";
};

let importIframeData = () => {
  let url = elDialogUrl.value;
  let label = elDialogLabel.value;
  if (url && label) {
    if (!isValidURL(url)) {
      ElMessage.error("网址格式不正确!");
    } else if (url.includes(WEB_URL)) {
      ElMessage.error("不可填写本页面域名!");
    } else {
      iframeListClone.value.push({
        url,
        label,
      });
      dialogCloseFun();
    }
  } else {
    ElMessage.warning("输入框不可为空!");
  }
};

// 初始默认选中
if (iframeListClone.value.length) {
  changeIframeFun(0, iframeListClone.value[0].url);
}
</script>

<style scoped lang="less">
@navigationBarWidth: 120px;
@navigationBarBottomHeight: 140px;
@mindMapBoxBackgroundColor: #c8c9cc;
.mind_map_box {
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  .navigation_bar_box {
    width: @navigationBarWidth;
    height: 100%;
    background-color: @mindMapBoxBackgroundColor;
    padding: 10px 0 0;
    box-sizing: border-box;
    .navigation_bar_btn_box {
      height: calc(100% - @navigationBarBottomHeight - 10px);
      overflow: hidden;
      overflow-y: auto;
      padding: 0 10px;
      margin-bottom: 10px;
      .navigation_bar_item {
        width: 100%;
        height: 30px;
        padding: 0 10px;
        line-height: 30px;
        box-sizing: border-box;
        border-radius: 5px;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        color: #fff;
      }
      .navigation_bar_item_on {
        color: #303133;
        background-color: #fff;
      }
    }
    .navigation_bar_bottom {
      height: @navigationBarBottomHeight;
      box-sizing: border-box;
      padding: 10px 10px 0;
      border-top: 2px solid #fff;
      .button {
        margin: 0;
      }
    }
  }
  .iframe_box {
    height: 100%;
    width: calc(100% - @navigationBarWidth - 2px);
    padding: 10px;
    box-sizing: border-box;
    background-color: @mindMapBoxBackgroundColor;
    margin-left: 2px;
    iframe {
      width: 100%;
      height: 100%;
      border: 1px solid #000;
      border-radius: 10px;
      box-sizing: border-box;
      background-color: #fff;
    }
  }
}
.dialog_main_box {
  .input_box {
    padding: 5px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      margin-right: 10px;
      font-weight: 700;
    }
    .input_box {
      width: calc(100% - 100px);
      box-sizing: border-box;
    }
  }
}
</style>

<style lang="less">
.mind_map_box {
  .navigation_bar_box {
    .navigation_bar_bottom {
      .el-button {
        margin: 10px 0 0;
      }
      .el-button:first-child {
        margin: 0;
      }
    }
  }
}
</style>
