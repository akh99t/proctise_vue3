import {
  type genericityChartConfiguration,
  type genericityLegendObj,
  type genericityTitleObj,
  type genericityOptionTy,
  type genericityChartTypes,
  type genericityAxisNodes,
  type genericitySeriesOption,
} from "./interface";

// 图表类型
export const chartTypes: Array<genericityChartTypes> = [
  {
    type: "line",
    title: "线图",
  },
  {
    type: "area",
    title: "面积图",
  },
  {
    type: "bar",
    title: "柱状图",
  },
  {
      type: 'pie',
      title: '饼图',
      disabled: true,
  },
  {
      type: 'top',
      title: 'Top图',
      disabled: true,
  },
  {
      type: 'bubble',
      title: '气泡图',
      disabled: true,
  },
];
// 相同展示方式的数组
export const chartTypeClassify: { [key: string]: string[] } = {
  A: ["line", "area", "bar"],
};

// 标题配置项列表
export const titleOptionFn = (key: string) => {
  let data: Array<genericityOptionTy> = [
    {
      key: "text",
      label: "标题",
      value: `这是 ${key}`,
      type: "input",
    },
    {
      key: "enabled",
      label: "是否展示",
      type: "switch",
      effect: "disabled",
      value: true,
    },
    {
      key: "floating",
      label: "是否浮动",
      value: false,
    },
    {
      key: "align",
      label: "水平对齐",
      value: "center",
      type: "radioGroup",
      data: [
        {
          label: "left",
          value: "左",
        },
        {
          label: "center",
          value: "中",
        },
        {
          label: "right",
          value: "右",
        },
      ],
    },
    {
      key: "xy",
      label: "偏移量",
      value: {
        x: 0,
        y: key === "subtitle" ? 30 : 10,
      },
      data: [],
    },
  ];
  return data;
};
// 标题配置项
export const titleObj: genericityTitleObj = {
  title: {
    text: "",
    align: "center",
    floating: false,
    x: 0,
    y: 0,
    enabled: true,
  },
  subtitle: {
    text: "",
    align: "center",
    floating: false,
    x: 0,
    y: 0,
    enabled: true,
  },
};

// 图例配置项列表
export const legendOption: Array<genericityOptionTy> = [
  {
    key: "enabled",
    label: "是否展示",
    type: "switch",
    effect: "disabled",
    value: true,
  },
  {
    key: "floating",
    label: "是否浮动",
    value: false,
    data: [],
  },
  {
    key: "align",
    label: "水平对齐",
    value: "center",
    type: "radioGroup",
    data: [
      {
        label: "left",
        value: "左",
      },
      {
        label: "center",
        value: "中",
      },
      {
        label: "right",
        value: "右",
      },
    ],
  },
  {
    key: "verticalAlign",
    label: "垂直对齐",
    value: "bottom",
    type: "radioGroup",
    data: [
      {
        label: "top",
        value: "上",
      },
      {
        label: "middle",
        value: "中",
      },
      {
        label: "bottom",
        value: "下",
      },
    ],
  },
  {
    key: "layout",
    label: "图例布局",
    value: "horizontal",
    type: "radioGroup",
    data: [
      {
        label: "horizontal",
        value: "水平布局",
      },
      {
        label: "vertical",
        value: "垂直布局",
      },
    ],
  },
  {
    key: "backgroundColor",
    label: "背景颜色",
    value: "",
  },
  {
    key: "xy",
    label: "偏移量",
    value: {
      x: 0,
      y: 0,
    },
    data: [],
  },
];
// 图例配置项
export const legendObj: genericityLegendObj = {
  legend: {
    enabled: true,
    floating: false,
    verticalAlign: "bottom",
    align: "center",
    x: 0,
    y: 0,
    layout: "horizontal",
    backgroundColor: "",
  },
};

// 节点配置项列表
export const nodeOption: Array<genericityOptionTy> = [
  {
    key: "nodes",
    label: "个数",
    type: "inputNumber",
    value: 5,
  },
  {
    key: "categories",
    label: "分类",
    value: "common",
    type: "radioGroup",
    data: [
      {
        label: "common",
        value: "普通轴",
      },
      {
        label: "custom",
        value: "自定义轴",
      },
    ],
  },
];
// 节点配置项
export const axisNodes: genericityAxisNodes = {
  axis: {
    nodes: 5,
    categories: "common",
    textarea: "",
  },
};

// 数据配置项列表
export const dataOption: Array<genericityOptionTy> = [
  {
    key: "explain",
    label: "说明",
    type: "explain",
    value: false,
  },
  {
    key: "importData",
    label: "导入数据",
    value: false,
    type: "button",
    data: [
      {
        label: "excel",
        value: "excel导入",
      },
      {
        label: "JSON",
        value: "JSON导入",
      },
    ],
  },
  {
    key: "randomData",
    label: "随机生成",
    value: false,
    type: "button",
    disabled: true,
    data: [
      {
        label: "randomData",
        value: "随机数据",
      },
    ],
  },
];
// 数据配置项
export const seriesOption: genericitySeriesOption = {
  list: [
    [1, 2, 3, 4, 5],
    [9, 8, null, 6, 5]
  ],
};
// chart所有配置项
export const chartConfiguration: genericityChartConfiguration[] = [
  {
    title: "类型",
    key: "chartType",
  },
  {
    title: "标题",
    key: "title",
  },
  {
    title: "图例",
    key: "legend",
  },
  {
    title: "节点",
    key: "node",
  },
  {
    title: "数据",
    key: "data",
  },
  // {
  //   title: '颜色',
  //   key: 'color',
  // }
];

// 图表默认配置
export const chartOptions: any = {
  title: {
    // 标题
    text: "这是标题",
    align: "center",
  },

  subtitle: {
    text: '副标题,可以插入html: <a href="http://www.baidu.com" target="_blank">百度</a>.',
    align: "center",
  },

  yAxis: {
    title: {
      text: "",
    },
  },

  legend: {
    layout: "vertical", // 垂直布局-vertical 水平布局 默认-horizontal
    floating: false, // 是否浮动
    backgroundColor: "pink",
    align: "center",
    x: 0,
    y: 0,
  },

  series: [
    {
      name: "series1",
      data: [
        43934, 48656, 65165, 81827, 112143, 142383, 171533, 165174, 155157,
        161454, 154610,
      ],
    },
    {
      name: "series2",
      data: [
        24916, 37941, 29742, 29851, 32490, 30282, 38121, 36885, 33726, 34243,
        31050,
      ],
    },
  ],
  xAxis: {
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
  },
};
