import React from 'react'
import { useCommonCodes } from './useCommonCodes'

export default function FoodSelect() {
  const { codes, loading, error } = useCommonCodes({ groupCode: 'FOOD' })

  if (loading) return <p>로딩 중...</p>
  if (error) return <p>에러 발생: {error}</p>

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
