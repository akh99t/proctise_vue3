export interface genericityChartConfiguration {
  title: string;
  key: string;
}

export interface genericityLegendObj {
  [key: string]: {
    enabled: boolean;
    floating: boolean;
    align: string;
    x: number;
    y: number;
    verticalAlign: string;
    layout: string;
    backgroundColor: string;
  };
}

export interface genericityTitleObj {
  [key: string]: {
    text: string;
    align: string;
    floating: boolean;
    x: number;
    y: number;
    showSubtitle?: boolean;
    enabled?: boolean;
  };
}

export interface genericityOptionTy {
  key: string;
  label: string;
  value: boolean | string | { x: number; y: number } | number;
  type?: string;
  effect?: string;
  disabled?: boolean;
  data?: Array<{
    label: string;
    value: string;
  }>;
}

export interface genericityAxisNodes {
  axis: {
    nodes: number,
    categories: string, 
    textarea: string
  }
}

export interface genericitySeriesOption {
  list: any[]
}

export interface genericityChartTypes {
  type: string;
  title: string;
  disabled?: boolean,
}