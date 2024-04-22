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
  {
    label: "LOL胜率榜",
    name: "LOLHot",
    url: "/crawler/hot",
    type: "option",
    imgIcon: "",
    imgUrl: "https://s-lol-web.op.gg/images/icon/opgglogo.svg?v=1710914129937",
    openUrl: "https://www.op.gg/champions/",
    formatDataFun: (data: { [key: string]: object }[]) => {
      let key: string[] = [];
      let obj: { [key: string]: any } = {};
      let column: { [key: string]: any }[] = [
        {
          label: "角色",
          prop: "name",
          width: "150",
          fixed: "left",
        },
        {
          label: "胜率",
          prop: "positionWinRate",
          width: "80",
        },
        {
          label: "登场率",
          prop: "positionPickRate",
          width: "80",
        },
        {
          label: "禁用率",
          prop: "positionBanRate",
          width: "80",
        },
        {
          label: "反制英雄",
          prop: "positionCounters",
          minWidth: "150",
          fixed: "right",
        },
      ];
      for (const k in data) {
        key.push(k);
        if (data[k] && Array.isArray(data[k])) {
          obj[k] = data[k].map((item: any) => {
            // 登场率-positionPickRate
            // 胜率-positionWinRate
            // 禁用率-positionBanRate
            // 反制列表-positionCounters
            let {
              name,
              key,
              image_url,
              positionWinRate,
              positionPickRate,
              positionBanRate,
              positionCounters,
            } = item;
            return {
              name,
              key,
              imgUrl: image_url,
              positionWinRate,
              positionPickRate,
              positionBanRate,
              positionCounters,
            };
          });
        }
      }
      return {
        key,
        obj,
        column,
      };
    },
  },
];
