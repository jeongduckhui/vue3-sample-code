import { axiosInstance } from '@/api'
import { onMounted, onUnmounted, ref, watch } from 'vue' // watch 추가
import { useAlert } from '../alert'

/**
 * useAxios 컴포저블
 *
 * @param {object|null} immediateConfig - 즉시 요청을 보낼 경우 axios 설정 객체. null이면 수동 요청.
 * @param {object} immediateRequestOptions - 즉시 요청에 대한 옵션 객체.
 */
export default function useAxios(
  immediateConfig = null,
  immediateRequestOptions = {},
) {
  const error = ref(null)
  const isLoading = ref(false)
  let controller = null // 요청 취소를 위한 AbortController

  const { errorAlert } = useAlert()

  // onUnmounted 훅을 컴포저블 스코프에 등록
  onUnmounted(() => {
    cancelRequest('component unmounted')
  })

  const sendRequest = async (config, requestOptions = {}) => {
    // 이전 요청이 있다면 취소
    if (controller) {
      controller.abort()
    }

    controller = new AbortController()
    const signal = controller.signal

    const { onSuccess, onError, throwOnError } = requestOptions

    isLoading.value = true

    try {
      const response = await axiosInstance({ ...config, signal })
      if (onSuccess) {
        onSuccess(response)
      }

      return response
    } catch (err) {
      // AbortError인 경우, 조용히 함수를 종료
      if (err.name === 'AbortError') {
        console.log('Request was aborted.')
        return
      }

      // 그 외의 일반적인 에러는 기존대로 처리
      if (throwOnError) {
        throw err
      } else {
        error.value = err
        errorAlert(err)
        if (onError) {
          onError(err)
        }
        return
      }
    } finally {
      isLoading.value = false
    }
  }

  // 요청 취소 함수
  const cancelRequest = (message = '요청이 취소되었습니다.') => {
    if (controller) {
      controller.abort(message)
    }
  }

  // immediateConfig가 전달되면 즉시 요청 로직 실행
  if (immediateConfig) {
    // URL이 반응형인지 확인 (ref 객체)
    if (
      typeof immediateConfig.url === 'object' &&
      immediateConfig.url.value !== undefined
    ) {
      watch(
        () => immediateConfig.url,
        newUrl => {
          if (newUrl) {
            sendRequest(
              { ...immediateConfig, url: newUrl.value },
              immediateRequestOptions,
            )
          }
        },
        { immediate: true },
      )
    } else {
      // URL이 일반 값인 경우 한 번만 요청
      onMounted(() => {
        sendRequest(immediateConfig, immediateRequestOptions)
      })
    }
  }

  return {
    isLoading,
    error,
    sendRequest,
    cancelRequest,
  }
}
