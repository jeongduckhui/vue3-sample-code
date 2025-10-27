import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAlertStore = defineStore('alert', () => {
  const alerts = ref([])
  let nextId = 0

  function addAlert(message, type, timeout = 2000) {
    const id = nextId++
    alerts.value.push({ id, message, type })

    setTimeout(() => {
      removeAlert(id)
    }, timeout)
  }

  function removeAlert(id) {
    const index = alerts.value.findIndex(alert => alert.id === id)
    if (index !== -1) {
      alerts.value.splice(index, 1)
    }
  }

  function errorAlert(message) {
    addAlert(message, 'error')
  }

  function successAlert(message) {
    addAlert(message, 'success')
  }

  return { alerts, errorAlert, successAlert, removeAlert }
})
