const noSpecialChars = {
  // 디렉티브가 바인딩된 요소가 DOM에 마운트될 때 호출됩니다.
  mounted(el) {
    // 입력 이벤트 리스너 추가
    const handleInput = event => {
      const value = event.target.value

      // 특수문자를 제거하는 정규식
      // 이 정규식은 한글, 영문 대소문자, 숫자, 공백만 허용합니다.
      const sanitizedValue = value.replace(/[^ㄱ-ㅎ가-힣a-zA-Z0-9\s]/g, '')

      // 입력된 값이 정제된 값과 다르면 업데이트
      if (value !== sanitizedValue) {
        event.target.value = sanitizedValue
        // v-model을 업데이트하기 위해 Vue가 감지할 수 있도록 처리
        // (이벤트를 강제 발생시키지 않아도, 직접 값을 변경하면 v-model이 업데이트됩니다.)
      }
    }

    // 입력 이벤트 리스너를 요소에 추가
    el.addEventListener('input', handleInput)

    // 언마운트 시 이벤트 리스너 제거를 위해 핸들러를 요소에 저장
    el._noSpecialCharsHandler = handleInput
  },

  // 디렉티브가 바인딩 해제될 때 이벤트 리스너를 정리합니다.
  unmounted(el) {
    if (el._noSpecialCharsHandler) {
      el.removeEventListener('input', el._noSpecialCharsHandler)
    }
  },
}

export default noSpecialChars
