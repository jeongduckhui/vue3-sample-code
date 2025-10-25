import { axiosInstance } from '@/api'
import { ref } from 'vue'

// 여기에 loading, alert store 추가하면 될 듯
// 하면서 paging 나오면 소스 찾아서 추가해보기

export default function useAxios() {
  // 로딩 변수는 store 시 필요없으면 삭제하고 따로 리턴해야 하면 놔두기
  const loading = ref(false)
  const error = ref(null)

  // 호출한 화면에서 성공메시지, 실패 메시지, 성공 콜백, 실패 콜백 보내면 적용하기.
  // 매개변수에 options 객체 추가해서 options에 담아서 보내기
  // successMessage, failMessage, onSuccess, onError
  const sendRequest = async (config, options = {}) => {
    loading.value = true
    const { successMessage, errorMessage, onSuccess, onError } = options

    try {
      const response = await axiosInstance(config)

      if (onSuccess) {
        onSuccess(res)
      }

      return response
    } catch (err) {
      error.value = err

      if (onError) {
        onError(err)
      }
    } finally {
      loading.value = false
    }
  }
  return {
    loading,
    error,
    sendRequest,
  }
}
