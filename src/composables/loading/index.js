import { useLoadingStore } from '@/stores/loading'
import { storeToRefs } from 'pinia'

export function useLoading() {
  const { isLoading } = storeToRefs(useLoadingStore())
  const { loadingOn, loadingOff } = useLoadingStore()

  return {
    isLoading,
    loadingOn,
    loadingOff,
  }
}
