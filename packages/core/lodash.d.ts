declare module 'lodash.clonedeep' {
  // 定义 cloneDeep 函数，接受任意类型的参数，并返回相同的类型
  function cloneDeep<T>(value: T): T
  // commonjs 导出
  export = cloneDeep
}
