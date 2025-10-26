import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAlertStore = defineStore('alert', () => {
  const alerts = ref([])

  function errorAlert(message, type = 'error') {
    alerts.value.push({ message, type })

    setTimeout(() => {
      alerts.value.shift()
    }, 2000)
  }

  function successAlert(message) {
    errorAlert(message, 'success')
  }

  return {
    alerts,
    errorAlert,
    successAlert,
  }
})
