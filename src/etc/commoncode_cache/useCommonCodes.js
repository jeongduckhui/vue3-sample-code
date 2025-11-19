import { useState, useEffect } from 'react'
import axios from 'axios'

// 프론트 메모리 캐시 (그룹코드별)
const codeCache = {}

/**
 * useCommonCodes 훅
 * @param {Object} options
 * @param {string} options.groupCode - 조회할 그룹코드
 * @param {string} [options.useYn] - 사용여부, 기본값 'Y'
 */
export function useCommonCodes({ groupCode, useYn = 'Y' }) {
  const [codes, setCodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true // 컴포넌트 언마운트 시 상태 업데이트 방지

    const fetchCodes = async () => {
      // 프론트 캐시 사용
      if (codeCache[groupCode]) {
        if (isMounted) {
          setCodes(codeCache[groupCode])
          setLoading(false)
        }
        return
      }

      setLoading(true)
      setError(null)

      try {
        const response = await axios.get('/api/common/codes', {
          params: { codeGroupNumber: groupCode, useYn },
        })

        if (isMounted) {
          setCodes(response.data)
          codeCache[groupCode] = response.data // 캐시에 저장
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
  }, [groupCode, useYn])

  return { codes, loading, error }
}
