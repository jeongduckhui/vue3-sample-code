// 이메일 유효성 검사를 위한 정규식
// 이 정규식은 대부분의 일반적인 이메일 형식을 검증합니다.
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

// 유효성 검사 함수
const validateEmail = (el, binding) => {
  const value = el.value
  if (!value) {
    el.classList.remove('is-valid')
    el.classList.remove('is-invalid')
    return
  }

  if (emailRegex.test(value)) {
    // 유효한 이메일 형식
    el.classList.add('is-valid')
    el.classList.remove('is-invalid')
  } else {
    // 유효하지 않은 이메일 형식
    el.classList.add('is-invalid')
    el.classList.remove('is-valid')
  }
}

const emailValidation = {
  // 디렉티브가 요소에 바인딩되었을 때 한 번만 호출됩니다.
  mounted(el, binding) {
    // 초기값에 대한 유효성 검사
    validateEmail(el, binding)

    // input 이벤트 리스너를 추가하여 값이 변경될 때마다 검사
    el.addEventListener('input', () => {
      validateEmail(el, binding)
    })
  },

  // v-model 값이 업데이트될 때마다 실행됩니다.
  updated(el, binding) {
    validateEmail(el, binding)
  },

  // 디렉티브가 바인딩 해제될 때 이벤트 리스너를 정리합니다.
  unmounted(el) {
    el.removeEventListener('input', () => {})
  },
}

export default emailValidation
