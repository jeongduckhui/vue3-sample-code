import { useLoadingStore } from '@/stores/loading'
import { storeToRefs } from 'pinia'

export function useLoading() {
  const { isLoading } = storeToRefs(useLoadingStore())
  const { loadingOn: storeLoadingOn, loadingOff: storeLoadingOff } =
    useLoadingStore()

  let timer = null
  const DELAY = 300 // 300ms 지연

  const loadingOn = () => {
    clearTimeout(timer) // 기존 타이머를 제거
    timer = setTimeout(() => {
      storeLoadingOn()
    }, DELAY)
  }

  const loadingOff = () => {
    clearTimeout(timer)
    storeLoadingOff()
  }

  return {
    isLoading,
    loadingOn,
    loadingOff,
  }
}
