import { axiosInstance } from '@/api'
import { ref } from 'vue'
import { useAlert } from '../alert'

export default function useAxios(options = {}) {
  const error = ref(null)
  const isLoading = ref(false)

  const { errorAlert } = useAlert()

  const sendRequest = async (config, requestOptions = {}) => {
    const { onSuccess, onError } = requestOptions

    isLoading.value = true

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
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    sendRequest,
  }
}
