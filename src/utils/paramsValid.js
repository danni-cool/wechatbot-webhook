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
      const emptyVal =
        (typeof item.val === 'string' && item.val === '') ||
        item.val === undefined
      const isFile = item.type === 'file' && item.val === 0

      // 必填非空校验
      if (item.required && emptyVal) {
        item.unValidReason = `${item.key} 不能为空`
      }

      //必填是文件（文件校验传入的size是否为0
      else if (item.required && isFile) {
        item.unValidReason = `${item.key} 上传的文件不能为空`
      }

      // 不管有无填值，类型是数组的情况，校验多个结构 e.g: type:[string, object]情况
      else if (equalTrueType(item.type, 'array')) {
        // @ts-expect-errors 此处已经做了array判断，some一定是数组
        item.unValidReason = item.type.some((type) =>
          equalTrueType(item.val, type)
        )
          ? ''
          : `${item.key} 的参数类型不是 ${item.type
              // @ts-expect-errors 此处已经做了array判断，some一定是数组
              .map((key) => capitalizeFirstLetter(key))
              .join(' or ')}`
      }

      // 不管有无填值，纯类型的校验
      else if (item.type !== 'file' && typeof item.val !== item.type) {
        item.unValidReason = `${
          item.key
          // @ts-expect-errors 此处已经是除了array 文件后的情况，期望是个普通类型，直接提示
        } 的参数类型不是 ${capitalizeFirstLetter(item.type)}`
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
