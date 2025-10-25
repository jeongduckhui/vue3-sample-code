import { wrap } from '@/utils'
import { usePagination } from './pagination'
import { computed } from 'vue'

export function useArrayPagination(array, options) {
  const arrayRef = wrap(array)

  const pagination = usePagination({
    ...{
      currentPage: 1,
      pageSize: 3,
    },
    ...options,
    total: computed(() => arrayRef.value.length),
  })

  const result = computed(() => {
    const array = arrayRef.value
    if (!Array.isArray(array)) return []
    return array.slice(
      pagination.offset.value,
      pagination.offset.value + pagination.pageSize.value,
    )
  })

  return {
    ...pagination,
    result,
  }
}
