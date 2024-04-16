<template>
  <!-- 网页数据总览 -->
  <div class="project_info_box">
    <div
      class="project_info_content_box"
      :style="{ height: projectInfoContentBoxHeight }"
      @mouseenter="hoverFun('mouseenter')"
      @mouseleave="hoverFun('mouseleave')"
    >
      <div
        class="item"
        v-for="({ label, value, type, url }, index) in list"
        :key="`item_key_${label}`"
      >
        <div class="label">{{ label }}</div>
        <div class="value" v-if="type === 'a'">
          <el-link v-if="url" type="primary" :href="url" target="_blank">{{
            value
          }}</el-link>
          <span v-else>--</span>
        </div>
        <div class="value" v-else>
          {{ value || "--" }}
        </div>
        <div class="icon" v-if="!index">
          <el-icon><ArrowDownBold /></el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getIPFun, ICP } from "@/constants";
import { browserInfo } from "@/plugins/browserInfo";
import { ref, nextTick, h } from "vue";

let _IP = ref("");
let _IP_LOCATION = ref("");
let projectInfoContentBoxHeight = ref("100%");
let list = ref([
  {
    label: "ICP",
    value: ICP,
  },
  {
    label: "IP",
    value: _IP,
  },
  {
    label: "IP归属地",
    value: _IP_LOCATION,
  },
  {
    label: "浏览器信息",
    value: browserInfo,
  },
  {
    label: "Web",
    value: "vue3 + ts",
  },
  {
    label: "服务器",
    value: "nodejs + mongodb",
  },
  {
    label: "github",
    value: "git仓库",
    url: "https://github.com/akh99t",
    type: "a",
  },
]);

// IP与IP归属地
nextTick(() => {
  getIPFun.then((data: any) => {
    let { IP, IP_LOCATION } = data;
    if (IP && IP_LOCATION) {
      _IP_LOCATION.value = IP_LOCATION;
      _IP.value = IP;
    }
  });
});

// 鼠标hover事件
let hoverFun = (type: string) => {
  let data = "100%";
  if (type === "mouseenter") {
    data = `${list.value.length * 100 || 100}%`;
  }
  projectInfoContentBoxHeight.value = data;
};
</script>

<style scoped lang="less">
@cssTransition: all 0.5s ease;
.project_info_box {
  width: 100%;
  height: 100%;
  position: relative;
  color: #fff;
  font-size: 10px;
  .project_info_content_box {
    position: absolute;
    overflow: hidden;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #303133;
    height: 100%;
    transition: @cssTransition;
    z-index: 999;
    border-radius: 0;
    .item {
      display: flex;
      align-items: center;
      line-height: 40px;
      .label {
        width: 70px;
        padding-right: 10px;
        font-weight: 500;
        border-right: 1px solid #fff;
        text-align: right;
      }
      .value {
        width: calc(100% - 121px);
        text-align: left;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        font-weight: 700;
        padding-left: 10px;
        box-sizing: border-box;
        a {
          width: 100%;
          font-weight: 700;
          font-size: 10px;
          text-align: left !important;
          // color: #fff;
          justify-content: flex-start;
        }
        span {
          text-align: left !important;
        }
      }
      .icon {
        width: 40px;
        transition: @cssTransition;
        text-align: center;
      }
    }
  }
  .project_info_content_box:hover {
    height: 400%;
    border-radius: 10px;
    background-color: #303133c0;
    .item {
      .icon {
        transform: rotate(180deg);
      }
    }
  }
}
</style>

<style lang="less"></style>
