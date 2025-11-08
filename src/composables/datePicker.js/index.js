import { ref } from 'vue'

export function useDatepickerInput() {
  const dpRef = ref(null)

  const getDpInputValue = () => {
    // dpRef.value가 있고, getInputValue 메서드가 있다면 그 반환값을 반환
    if (dpRef.value && typeof dpRef.value.getInputValue === 'function') {
      return dpRef.value.getInputValue()
    }
    // 그렇지 않다면 null을 반환
    return null
  }

  return {
    dpRef,
    getDpInputValue,
  }
}
