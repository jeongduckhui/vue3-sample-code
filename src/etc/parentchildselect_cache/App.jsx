import React, { useEffect } from 'react'
import DependentSelects from './DependentSelects'
import { useCommonCodes } from './useCommonCodes'

export default function App() {
  // 초기 prefetch
  useEffect(() => {
    useCommonCodes({ groupCode: 'CATEGORY', prefetch: true })
    useCommonCodes({ groupCode: 'ITEM', prefetch: true })
  }, [])

  return (
    <div>
      <h1>공통코드 의존형 Select 예제</h1>
      <DependentSelects />
    </div>
  )
}
