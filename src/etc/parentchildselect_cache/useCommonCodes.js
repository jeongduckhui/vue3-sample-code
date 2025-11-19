import { useState, useEffect } from 'react'
import axios from 'axios'

// 메모리 캐시
const codeCache = {}

export function useCommonCodes({
  groupCode,
  parentCode = null,
  prefetch = false,
}) {
  const [codes, setCodes] = useState([])
  const [loading, setLoading] = useState(prefetch)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const cacheKey = parentCode ? `${groupCode}-${parentCode}` : groupCode

    if (codeCache[cacheKey]) {
      if (isMounted) {
        setCodes(codeCache[cacheKey])
        setLoading(false)
      }
      return
    }

    const fetchCodes = async () => {
      setLoading(true)
      setError(null)

      try {
        const params = { codeGroupNumber: groupCode, useYn: 'Y' }
        if (parentCode) params.parentCode = parentCode

        const response = await axios.get('/api/common/codes', { params })

        if (isMounted) {
          setCodes(response.data)
          codeCache[cacheKey] = response.data
          setLoading(false)
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || '서버 요청 실패')
          setLoading(false)
        }
      }
    }

    fetchCodes()

    return () => {
      isMounted = false
    }
  }, [groupCode, parentCode])

  return { codes, loading, error }
}
