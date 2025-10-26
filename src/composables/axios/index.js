import { axiosInstance } from '@/api'
import { ref } from 'vue'
import { useAlert } from '../alert'
import { useLoading } from '../loading'

export default function useAxios() {
  // 로딩 변수는 store 시 필요없으면 삭제하고 따로 리턴해야 하면 놔두기
  // const isLoading = ref(false)
  const error = ref(null)

  const { isLoading, loadingOn, loadingOff } = useLoading()
  const { errorAlert } = useAlert()

  const sendRequest = async (config, options = {}) => {
    // isLoading.value = true
    loadingOn()

    // 성공 콜백함수, 실패 콜백함수
    const { onSuccess, onError, onFinally } = options

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
      // isLoading.value = false
      loadingOff()

      if (onFinally) {
        onFinally()
      }
    }
  }
  return {
    isLoading,
    error,
    sendRequest,
  }
}
