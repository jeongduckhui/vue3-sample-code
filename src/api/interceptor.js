import { axiosInstance } from '.'
import { useLoadingStore } from '@/stores/loading'

axiosInstance.interceptors.request.use(
  config => {
    useLoadingStore().loadingOn()
    return config
  },
  error => {
    useLoadingStore().loadingOff()
    return Promise.reject(error)
  },
)

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  response => {
    useLoadingStore().loadingOff()
    return response
  },
  error => {
    useLoadingStore().loadingOff()
    return Promise.reject(error)
  },
)
