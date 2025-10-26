const toLowerCase = {
  // 디렉티브가 바인딩된 요소가 DOM에 마운트될 때 호출됩니다.
  mounted(el) {
    // input 이벤트 리스너 추가
    const handleInput = event => {
      const originalValue = event.target.value
      const lowercaseValue = originalValue.toLowerCase()

      if (originalValue !== lowercaseValue) {
        const start = event.target.selectionStart
        const end = event.target.selectionEnd

        event.target.value = lowercaseValue

        event.target.setSelectionRange(start, end)
      }
    }

    el.addEventListener('input', handleInput)
    el._toLowerCaseHandler = handleInput
  },

  // v-model 값이 변경될 때도 대문자로 변환하도록 updated 훅 추가
  updated(el, binding) {
    // binding.value가 유효한지 확인
    if (binding.value && el.value !== binding.value.toLowerCase()) {
      el.value = binding.value.toLowerCase()
    }
  },

  // 디렉티브가 바인딩 해제될 때 이벤트 리스너를 정리합니다.
  unmounted(el) {
    if (el._toLowerCaseHandler) {
      el.removeEventListener('input', el._toLowerCaseHandler)
    }
  },
}

export default toLowerCase
