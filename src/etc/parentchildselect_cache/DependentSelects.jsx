import React, { useState } from 'react'
import { useCommonCodes } from './useCommonCodes'

export default function DependentSelects() {
  const [selectedCategory, setSelectedCategory] = useState('')
  const { codes: categories, loading: loadingCat } = useCommonCodes({
    groupCode: 'CATEGORY',
    prefetch: true,
  })
  const { codes: items, loading: loadingItem } = useCommonCodes({
    groupCode: 'ITEM',
    parentCode: selectedCategory,
  })

  return (
    <div>
      <h2>상위 카테고리</h2>
      {loadingCat ? (
        <p>로딩 중...</p>
      ) : (
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
        >
          <option value="">선택하세요</option>
          {categories.map(c => (
            <option key={c.code} value={c.code}>
              {c.codeName}
            </option>
          ))}
        </select>
      )}

      <h2>하위 아이템</h2>
      {loadingItem ? (
        <p>로딩 중...</p>
      ) : (
        <select disabled={!selectedCategory}>
          <option value="">선택하세요</option>
          {items.map(i => (
            <option key={i.code} value={i.code}>
              {i.codeName}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}
