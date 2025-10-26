import { useAlertStore } from '@/stores/alert'
import { storeToRefs } from 'pinia'

export function useAlert() {
  const { alerts } = storeToRefs(useAlertStore())
  const { errorAlert, successAlert } = useAlertStore()

  return {
    alerts,
    errorAlert,
    successAlert,
  }
}
