/*
사용법: v-max-length="10". 10자 이내
*/

const maxLength = {
  // 디렉티브가 바인딩된 요소가 DOM에 마운트될 때 호출됩니다.
  mounted(el, binding) {
    // binding.value로 전달된 제한 길이를 가져옵니다.
    const limit = parseInt(binding.value, 10)

    // 유효한 숫자가 아닌 경우 경고를 띄우고 종료합니다.
    if (isNaN(limit)) {
      console.warn('[v-max-length] The provided value is not a valid number.')
      return
    }

    // 입력 이벤트 리스너 추가
    const handleInput = event => {
      const value = event.target.value

      // 입력된 값의 길이가 제한 길이를 초과하는 경우
      if (value.length > limit) {
        // 초과된 부분을 잘라냅니다.
        const trimmedValue = value.slice(0, limit)
        event.target.value = trimmedValue

        // v-model을 업데이트합니다.
        // `input` 이벤트를 직접 발생시키지 않고, 이벤트 객체의 값을 수정하여 Vue가 감지하도록 합니다.
        // (이 방식은 `<input>` 태그에서만 동작하며, `v-model`과 함께 사용될 때 효과적입니다.)
      }
    }

    // 이벤트 리스너를 요소에 추가
    el.addEventListener('input', handleInput)

    // 언마운트 시 이벤트 리스너 제거를 위해 핸들러를 요소에 저장
    el._maxLengthHandler = handleInput
  },

  // 디렉티브가 바인딩 해제될 때 이벤트 리스너를 정리합니다.
  unmounted(el) {
    if (el._maxLengthHandler) {
      el.removeEventListener('input', el._maxLengthHandler)
    }
  },
}

export default maxLength
