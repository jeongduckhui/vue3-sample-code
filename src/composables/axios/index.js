import { axiosInstance } from '@/api'
import { ref } from 'vue'
import { useAlert } from '../alert'
import { useLoading as useGlobalLoading } from '../loading' // 전역 로딩 훅

export default function useAxios(options = {}) {
  const { globalLoading = true } = options
  const error = ref(null)
  const isLoading = ref(false) // 로컬 로딩 상태

  const { loadingOn: globalLoadingOn, loadingOff: globalLoadingOff } =
    useGlobalLoading()
  const { errorAlert } = useAlert()

  const sendRequest = async (config, requestOptions = {}) => {
    const { onSuccess, onError } = requestOptions

    isLoading.value = true // 로컬 로딩 시작
    if (globalLoading) {
      globalLoadingOn() // 전역 로딩 시작
    }

    try {
      const response = await axiosInstance(config)
      if (onSuccess) {
        onSuccess(response)
      }
      return response
    } catch (err) {
      error.value = err
      errorAlert(err)
      if (onError) {
        onError(err)
      }
    } finally {
      isLoading.value = false // 로컬 로딩 종료
      if (globalLoading) {
        globalLoadingOff() // 전역 로딩 종료
      }
    }
  }

  return {
    isLoading, // 로컬 로딩 상태 반환
    error,
    sendRequest,
  }
}
