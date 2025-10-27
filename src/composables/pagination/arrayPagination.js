import { wrap } from '@/utils'
import { usePagination } from './pagination'
import { computed } from 'vue'

export function useArrayPagination(array, options) {
  // 입력된 array가 ref가 아니더라도 반응형으로 만들기 위해 wrap 사용
  const arrayRef = wrap(array)

  const pagination = usePagination({
    // 기본 옵션
    currentPage: 1,
    pageSize: 3,
    // 외부에서 전달된 옵션으로 덮어쓰기
    ...options,
    // array의 길이를 total로 사용, 이 값은 항상 최종적으로 덮어씌워져야 함
    total: computed(() => arrayRef.value.length),
  })

  const result = computed(() => {
    const data = arrayRef.value
    if (!Array.isArray(data)) {
      return []
    }

    // pagination 훅의 offset과 pageSize를 사용해 배열 슬라이스
    const startIndex = pagination.offset.value
    const endIndex = startIndex + pagination.pageSize.value
    return data.slice(startIndex, endIndex)
  })

  return {
    ...pagination,
    result,
  }
}
