// 숫자에 콤마를 추가하는 함수
const addCommas = value => {
  if (value === null || value === undefined) return ''
  value = String(value).replace(/[^0-9.]/g, '') // 숫자와 소수점 외 문자 제거
  const parts = value.split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

// 콤마를 제거하고 순수한 숫자만 반환하는 함수
const removeCommas = value => {
  if (value === null || value === undefined) return ''
  return String(value).replace(/,/g, '')
}

const commaNumber = {
  // 디렉티브가 바인딩된 요소가 DOM에 마운트될 때 호출됩니다.
  mounted(el, binding) {
    // 포커스 아웃 이벤트 핸들러 (콤마 추가)
    el.addEventListener('blur', event => {
      const cleanValue = removeCommas(event.target.value)
      event.target.value = addCommas(cleanValue)
    })

    // 포커스 인 이벤트 핸들러 (콤마 제거)
    el.addEventListener('focus', event => {
      event.target.value = removeCommas(event.target.value)
    })

    // 입력 이벤트 핸들러 (v-model 업데이트)
    el.addEventListener('input', event => {
      // v-model을 위한 값은 콤마 없는 순수한 숫자로 전달
      event.target.value = removeCommas(event.target.value)
    })

    // 초기값 설정 (마운트 시)
    if (binding.value !== null && binding.value !== undefined) {
      el.value = addCommas(String(binding.value))
    }
  },

  // v-model 값이 업데이트될 때마다 실행됩니다.
  updated(el, binding) {
    // 포커스가 없을 때만 업데이트 (콤마 추가)
    if (document.activeElement !== el) {
      el.value = addCommas(String(binding.value))
    }
  },

  // 디렉티브가 바인딩 해제될 때 이벤트 리스너를 정리합니다.
  unmounted(el) {
    el.removeEventListener('focus', () => {})
    el.removeEventListener('blur', () => {})
    el.removeEventListener('input', () => {})
  },
}

export default commaNumber
