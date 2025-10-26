const korLangOnly = {
  // el.value = el.value.replace(/[^ㄱ-ㅎ가-힣0-9\s]/g, ''); // 한글, 숫자
  // el.value = el.value.replace(/[a-zA-Z]/g, ''); // 영문 알파벳 제외한 모든 문자

  // 디렉티브가 요소에 바인딩되었을 때 한 번만 호출됩니다.
  mounted(el) {
    let isComposing = false

    // IME 입력이 시작될 때 (한글 조합 중)
    el.addEventListener('compositionstart', () => {
      isComposing = true
    })

    // IME 입력이 끝날 때
    el.addEventListener('compositionend', () => {
      isComposing = false
      // 조합이 끝난 후 값을 한 번 더 검증
      el.value = el.value.replace(/[^ㄱ-ㅎ가-힣\s]/g, '')
      el.dispatchEvent(new Event('input')) // v-model 업데이트를 위해 input 이벤트 강제 발생
    })

    // 일반적인 입력(IME 조합 중이 아닐 때)
    el.addEventListener('input', event => {
      // 조합 중이 아닐 때만 검사
      if (!isComposing) {
        // 영문, 숫자, 특수문자 등을 제거하고 한글과 공백만 남깁니다.
        event.target.value = event.target.value.replace(/[^ㄱ-ㅎ가-힣\s]/g, '')

        // v-model을 사용하는 경우, 바인딩된 값도 업데이트되도록 합니다.
        // 이 처리는 `compositionend`에서 이미 수행되므로, 여기서는 한 번 더 보강하는 개념입니다.
      }
    })
  },
  // 디렉티브가 바인딩 해제될 때 이벤트 리스너를 정리합니다.
  unmounted(el) {
    el.removeEventListener('compositionstart', () => {})
    el.removeEventListener('compositionend', () => {})
    el.removeEventListener('input', () => {})
  },
}

export default korLangOnly
