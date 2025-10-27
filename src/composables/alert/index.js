import { useAlertStore } from '@/stores/alert'
import { storeToRefs } from 'pinia'

export function useAlert() {
  // 스토어 인스턴스를 가져옵니다.
  const store = useAlertStore()

  // alerts 상태는 storeToRefs로 추출하여 반응성을 유지합니다.
  const { alerts } = storeToRefs(store)

  // 액션은 스토어 인스턴스에서 직접 추출합니다.
  const { errorAlert, successAlert, removeAlert } = store

  // 반환 객체에 removeAlert를 포함시킵니다.
  return {
    alerts,
    errorAlert,
    successAlert,
    removeAlert,
  }
}
