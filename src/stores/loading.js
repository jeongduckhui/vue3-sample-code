import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
  const loadingCount = ref(0) // 요청 카운터로 변경

  // 진행 중인 요청이 있는지 확인하는 computed 속성
  const isLoading = computed(() => loadingCount.value > 0)

  function loadingOn() {
    loadingCount.value++
  }

  function loadingOff() {
    // 카운터가 0보다 클 때만 감소
    if (loadingCount.value > 0) {
      loadingCount.value--
    }
  }

  return {
    isLoading, // 이제 computed 속성
    loadingOn,
    loadingOff,
  }
})
