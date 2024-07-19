/** 可选属性里面3选一必填 */
export type RequireOne<T, Keys extends keyof T = keyof T> = Omit<T, Keys> &
  {
    [K in Keys]: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, never>>
  }[Keys]
