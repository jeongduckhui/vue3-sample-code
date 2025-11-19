import { useEffect, useState } from 'react'
import axios from 'axios'

export default function CommonCodeSelect() {
  const [codes, setCodes] = useState([])

  const fetchCodes = async () => {
    try {
      const response = await axios.get('/api/common/codes', {
        params: {
          codeGroupNumber: 'FOOD',
          useYn: 'Y',
        },
      })

      console.log('서버 응답:', response.data)
      setCodes(response.data)
    } catch (error) {
      console.error('에러 발생:', error)
    }
  }

  useEffect(() => {
    fetchCodes()
  }, [])

  return (
    <select>
      <option value="">선택하세요</option>
      {codes.map(item => (
        <option key={item.code} value={item.code}>
          {item.codeName}
        </option>
      ))}
    </select>
  )
}
