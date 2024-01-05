// 简化版 nextTick 函数，仅使用 Promise
// credit: https://github.com/vuejs/vue/blob/main/src/core/util/next-tick.ts
const { logger } = require('./log')
/**@type {any[]} */
const callbacks = []
const freezedTickQueueMap = new Map()
let pending = false
let id = 0
/**
 * 微任务回调
 * @param {(arg0:any) => any} [cb]
 * @param {{ctx?: any, freezed?:boolean, freezedTickId?:number}} [opt]
 * @returns
 */
const nextTick = async (cb, opt) => {
  /**@type {(value:any)=>void | undefined} */
  let _resolve

  const { ctx, freezed, freezedTickId } = opt || {}

  // 将一个新的函数加入 callbacks 队列
  ;(freezed ? freezedTickQueueMap.get(freezedTickId) : callbacks).push(() => {
    if (typeof cb === 'function') {
      try {
        // 如果提供了回调函数，立即执行
        // @ts-expect-errors 此处不需要第二参数
        cb.call(ctx)
      } catch (e) {
        // 如果有错误，使用 handleError 处理
        handleError(e)
      }
    } else if (typeof _resolve === 'function') {
      // 如果没有回调函数，但有 _resolve 函数（由 Promise 提供），则调用它
      _resolve(ctx)
    }
  })

  if (!pending && !freezed) {
    pending = true
    // 使用 Promise 来处理 callbacks 队列
    Promise.resolve().then(flushCallbacks)
  }

  // 如果没有提供回调函数，返回一个新的 Promise
  if (typeof cb !== 'function') {
    return await new Promise((resolve) => {
      _resolve = resolve
    })
  }
}

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

/**
 * handleError 和其他辅助函数需要根据实际情况实现
 * @param {unknown} e
 */
function handleError(e) {
  logger.error('消息任务执行失败：', e)
}

//增加暂时不被执行的队列
class messageQueue {
  constructor() {
    this.id = id++
    freezedTickQueueMap.set(id, [])
  }

  /**
   * @param {(arg0:any) => any} cb
   */
  push(cb) {
    nextTick(cb, { freezed: true, freezedTickId: this.id })
  }

  flush() {
    const unfreezeQueue = freezedTickQueueMap.get(this.id)
    nextTick(() => {
      logger.info('开始发送队列消息')
    })
    unfreezeQueue.forEach((/** @type {any} */ item) => {
      callbacks.push(item)
    })

    freezedTickQueueMap.delete(this.id)
  }
}

module.exports = {
  nextTick,
  messageQueue
}
