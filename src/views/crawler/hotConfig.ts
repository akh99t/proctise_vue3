import { ZHIHU_ICON, BLBL_ICON } from "@/assets/icon";

export const HOT_LIST = [
  {
    label: "BLBL综合热门",
    name: "BLBLHot",
    url: "/crawler/hot",
    imgIcon: BLBL_ICON,
    openUrl: "https://www.bilibili.com/video/",
    formatDataFun: (data: []) => {
      return data.map((item: { [key: string]: any }) => {
        let { title, pic, owner, stat, rcmd_reason, tname, bvid } = item || {};
        let tags = [tname];
        if (rcmd_reason && rcmd_reason.content) {
          tags.push(rcmd_reason.content);
        }
        return {
          title,
          imgUrl: pic,
          name: owner?.name || "",
          view: stat?.view || 0,
          reply: stat?.reply || 0,
          tags,
          id: bvid,
        };
      });
    },
  },
  {
    label: "zhihu热榜",
    name: "zhihuHot",
    url: "/crawler/hot",
    imgIcon: ZHIHU_ICON,
    openUrl: "https://www.zhihu.com/question/",
    formatDataFun: (data: []) => {
      return data.map((item: { [key: string]: any }) => {
        let { target, detail_text, children } = item || {};
        let imgUrl = "";
        if (children && children.length) {
          imgUrl = children[0]?.thumbnail || "";
        }
        let { title, id, excerpt } = target || {};
        return {
          title,
          subtitle: excerpt,
          id,
          imgUrl,
          name: detail_text,
        };
      });
    },
  },
];
