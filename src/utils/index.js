import { isRef, ref } from 'vue'

export function unwrap(o) {
  return isRef(o) ? o.value : o
}

export function wrap(o) {
  return isRef(o) ? o : ref(o)
}

export const isArray = Array.isArray

export const isFunction = val => typeof val === 'function'

export const isString = val => typeof val === 'string'

export const isSymbol = val => typeof val === 'symbol'

export const isBoolean = val => typeof val === 'boolean'

export const isUndefined = val => typeof val === 'undefined'

export const isNull = val => typeof val === null

export const isDate = val => isObject(val) && isFunction(val.getTime)

export const isNumber = val => typeof val === 'number'

export const isObject = val => val !== null && typeof val === 'object'

export const isElement = val => isObject(val) && !!val.tagName

export function isPromise(val) {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch)
}

export function minMax(val, min, max) {
  if (val < min) return min
  if (val > max) return max
  return val
}

// 사용법: i18n.value = deepClone<any>({}, fb, unwrap(v))
export function deepClone(result, ...sources) {
  for (let i = 0; i < sources.length; i++) {
    const source = sources[i]
    if (source === undefined || !isObject(source)) continue

    const keys = Object.keys(source)

    for (let j = 0; j < keys.length; j++) {
      const k = keys[j]
      const v = unwrap(source[k])
      const sourceType = typeof v
      const type = typeof result[k]

      if (result[k] === undefined || sourceType === type) {
        result[k] = isObject(v)
          ? deepClone < any > (result[k] || {}, v)
          : source[k] // source[k] is assigned because if is ref we want to override to this ref
      }
    }
  }
  return result
}

/**
 * 년월일(YYYYMMDD) 형태의 데이터를 Date로 반환합니다.
 * 단, 파라미터가 'YYYYMMDD'의 형식이 아니면 현재일자를 기준으로 반환
 *
 * @param {string} dateStr (YYYYMMDD)
 * @returns {Date}
 */
export const parseYYYYMMDD = dateStr => {
  if (dateStr && dateStr.length == 8) {
    const year = Number(dateStr.substring(0, 4))
    const month = Number(dateStr.substring(4, 6))
    const day = Number(dateStr.substring(6, 8))
    return new Date(year, month - 1, day) // 월은 0-11이므로 1을 빼줍니다
  } else {
    return new Date()
  }
}
