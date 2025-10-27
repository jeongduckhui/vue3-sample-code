import { axiosInstance } from '@/api'
import { ref } from 'vue'
import { useAlert } from '../alert'

export default function useAxios() {
  const error = ref(null)
  const isLoading = ref(false)
  let controller = null // 요청 취소를 위한 AbortController

  const { errorAlert } = useAlert()

  const sendRequest = async (config, requestOptions = {}) => {
    // 이전 요청이 있다면 취소
    if (controller) {
      controller.abort()
    }

    controller = new AbortController()
    const signal = controller.signal

    const { onSuccess, onError } = requestOptions

    isLoading.value = true

    try {
      const response = await axiosInstance({ ...config, signal })
      if (onSuccess) {
        onSuccess(response)
      }

      return response
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Request was aborted.')
        return
      }

      error.value = err
      errorAlert(err)

      if (onError) {
        onError(err)
      }

      // 에러를 다시 던져서 사용하는 쪽에서 추가적으로 처리할 수 있도록 함
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 요청 취소 함수
  const cancelrequest = (message = '요청이 취소되었습니다.') => {
    if (controller) {
      controller.abort(message)
    }
  }

  return {
    isLoading,
    error,
    sendRequest,
    cancelrequest,
  }
}
