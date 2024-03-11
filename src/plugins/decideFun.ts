// 判断入参1是否是数组, 入参2为函数, 条件成立则执行, 否则执行入参3
export const decideIsArrayFun = (
  data: any,
  fun1: Function,
  fun2?: Function | null
) => {
  if (Array.isArray(data)) {
    fun1(data);
  } else {
    fun2 ? fun2() : null;
  }
};
