const cache = {
  room: new Map()
}

const cacheTool = {
  /**
   * Sets a value in the specified cache namespace with an optional expiration.
   * Before setting a value, it clears any expired keys.
   *
   * @param {keyof cache} namespace - The cache namespace to use.
   * @param {{id: string, value: any, expired: number}} payload - The payload containing id and value.
   */
  set(namespace, { id, value, expired = 0 }) {
    // 每次增加数据前检查有无过期，要清理
    clearExpiredKeys(cache[namespace])

    Object.defineProperty(value, '_expired', {
      value: Date.now() + expired,
      enumerable: false
    })

    cache[namespace].set(id, value)
  },
  /**
   * 从缓存里取数据，如果过期时间到了就返回undefined
   * @param {keyof cache} namespace
   * @param {string} id
   */
  get(namespace, id) {
    if (!(namespace in cache)) {
      return
    }

    const result = cache[namespace].get(id)

    if (!result) return

    if (result._expired < Date.now()) {
      cache[namespace].delete(id)
      return
    } else {
      return result
    }
  },

  /**
   * @param {keyof cache} namespace
   * @param {string} id
   */
  del(namespace, id) {
    cache[namespace].delete(id)
  }
}

/**
 * @param {Map<string,any>} cacheMap
 */
function clearExpiredKeys(cacheMap) {
  Object.keys(cacheMap).forEach((id) => {
    if (cacheMap.get(id)._expired < Date.now()) {
      cacheMap.delete(id)
    }
  })
}

module.exports = cacheTool
