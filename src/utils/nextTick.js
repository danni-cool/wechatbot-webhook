// 简化版 nextTick 函数，仅使用 Promise
// credit: https://github.com/vuejs/vue/blob/main/src/core/util/next-tick.ts
const callbacks = []
let pending = false

function flushCallbacks() {
  pending = false
  // slice(0) 从数组的第一个元素开始复制，所以复制的是整个数组。
  // 在执行回调的过程中，新的回调可能会被添加到 callbacks 数组中。使用副本确保仅执行函数开始时已经存在的回调。
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}

// handleError 和其他辅助函数需要根据实际情况实现
function handleError(e, ctx, source) {
  // 错误处理逻辑...
}

module.exports.nextTick = (cb, ctx) => {
  let _resolve

  // 将一个新的函数加入 callbacks 队列
  callbacks.push(() => {
    if (cb) {
      try {
        // 如果提供了回调函数，立即执行
        cb.call(ctx)
      } catch (e) {
        // 如果有错误，使用 handleError 处理
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      // 如果没有回调函数，但有 _resolve 函数（由 Promise 提供），则调用它
      _resolve(ctx)
    }
  })

  if (!pending) {
    pending = true
    // 使用 Promise 来处理 callbacks 队列
    Promise.resolve().then(flushCallbacks)
  }

  // 如果没有提供回调函数，返回一个新的 Promise
  if (!cb) {
    return new Promise((resolve) => {
      _resolve = resolve
    })
  }
}
