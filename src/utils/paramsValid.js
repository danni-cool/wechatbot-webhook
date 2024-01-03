/**
 * @param {any} val
 * @param {string} expectType
 */
function equalTrueType(val, expectType) {
  return (
    Object.prototype.toString.call(val).toLowerCase() ===
    `[object ${expectType}]`
  )
}

/**
 * @param {string} str
 */
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * 校验输入参数
 * @param {pushMsgValidPayload[]} arr
 * @returns {{unValidReason:string}[]|[]} 返回不通过校验的数组项，并填充上 unValidReason 的原因
 */
function getUnValidParamsList(arr) {
  return arr
    .map((item) => {
      // 区分必填和非必填情况，校验非空和类型
      if (item.required) {
        if (item.val === '') {
          item.unValidReason = `${item.key} 不能为空`
          // 文件类型特殊校验
        } else if (item.type === 'file' && item.val === 0) {
          item.unValidReason = `${item.key} 上传的文件不能为空`
          // e.g: type:[string, object]情况
        } else if (equalTrueType(item.type, 'array')) {
          // @ts-expect-errors 此处已经做了array判断，some一定是数组
          item.unValidReason = item.type.some((type) =>
            equalTrueType(item.val, type)
          )
            ? ''
            : `${item.key} 的参数类型不是 ${item.type
                // @ts-expect-errors 此处已经做了array判断，some一定是数组
                .map((key) => capitalizeFirstLetter(key))
                .join(' or ')}`
        } else if (item.type !== 'file' && typeof item.val !== item.type) {
          item.unValidReason = `${
            item.key
            // @ts-expect-errors 此处已经是除了array 文件后的情况，期望是个普通类型，直接提示
          } 的参数类型不是 ${capitalizeFirstLetter(item.type)}`
        }
      }

      // 前者通过，如果遇到要校验指定枚举值的情况
      if (
        item.unValidReason === '' &&
        Array.isArray(item.enum) &&
        item.enum.length > 0
      ) {
        item.unValidReason = !item.enum.includes(item.val)
          ? `${item.key} 必须是 ${item.enum.join(' or ')}`
          : ''
      }

      return item
    })
    .filter(({ unValidReason }) => unValidReason)
}

module.exports = {
  getUnValidParamsList,
  equalTrueType
}
