import axios from 'axios'

const baseURL = import.meta.env.VITE_APP_API_URL

function create(baseURL, options) {
  const instance = axios.create(Object.assign({ baseURL }, options))

  return instance
}

export const axiosInstance = create(baseURL)
