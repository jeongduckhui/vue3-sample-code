import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
  const isLoading = ref(false)

  function loadingOn() {
    isLoading.value = true
  }

  function loadingOff() {
    isLoading.value = false
  }

  return {
    isLoading,
    loadingOn,
    loadingOff,
  }
})
