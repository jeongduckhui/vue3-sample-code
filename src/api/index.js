import axios from 'axios'
import axiosRetry from 'axios-retry'

const API_BASE_URL = import.meta.env.VITE_APP_API_URL

function createAxiosInstance(baseURL, options) {
  const instance = axios.create(
    Object.assign(
      {
        baseURL,
        timeout: 10000, // 10초 타임아웃. 일단 10초로 하고 상황에 맞게 수정해야 함
      },
      options,
    ),
  )

  axiosRetry(instance, {
    retries: 3, // 재시도 횟수 설정
    retryDelay: axiosRetry.exponentialDelay, // 지수 백오프 방식의 지연 시간 설정 (권장)
    retryCondition: error => {
      // 요청 메서드가 'get'인 경우에만 재시도
      return (
        error.config.method === 'get' &&
        axiosRetry.isNetworkOrIdempotentRequestError(error)
      )
    },
  })

  return instance
}

export const axiosInstance = createAxiosInstance(API_BASE_URL)
