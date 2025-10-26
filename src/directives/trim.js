const trim = {
  // 디렉티브가 바인딩된 요소가 DOM에 마운트될 때 호출됩니다.
  mounted(el) {
    // 포커스 아웃 이벤트 리스너 추가
    const handleBlur = event => {
      const value = event.target.value
      const trimmedValue = value.trim()

      // 입력된 값이 정제된 값과 다르면 업데이트
      if (value !== trimmedValue) {
        event.target.value = trimmedValue

        // v-model을 업데이트하기 위해 input 이벤트를 강제로 발생시킵니다.
        // `dispatchEvent`를 사용해도 스택 오버플로우가 발생하지 않는 이유는
        // `blur` 이벤트에서만 실행되기 때문입니다.
        event.target.dispatchEvent(new Event('input', { bubbles: true }))
      }
    }

    // 이벤트 리스너를 요소에 추가
    el.addEventListener('blur', handleBlur)

    // 언마운트 시 이벤트 리스너 제거를 위해 핸들러를 요소에 저장
    el._trimHandler = handleBlur
  },

  // 디렉티브가 바인딩 해제될 때 이벤트 리스너를 정리합니다.
  unmounted(el) {
    if (el._trimHandler) {
      el.removeEventListener('blur', el._trimHandler)
    }
  },
}

export default trim
