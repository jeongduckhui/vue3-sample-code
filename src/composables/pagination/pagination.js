import { isNumber, minMax, wrap } from '@/utils'
import { computed, ref, watch } from 'vue'

/**
 * Create a pagination controller based on the arguments
 * @param options - pageSize, total, currentPage
 */
export function usePagination(options) {
  const _currentPage = wrap(options.currentPage)
  const _pageSize = wrap(options.pageSize)
  const total = wrap(options.total)

  // offset을 computed로 변경하여 currentPage 또는 pageSize 변경 시 자동 업데이트
  const offset = computed(() => (_currentPage.value - 1) * _pageSize.value)

  // lastPage는 pageSize와 total에 의존하는 computed 속성
  const lastPage = computed(() =>
    Math.max(1, Math.ceil(total.value / _pageSize.value)),
  )

  const currentPage = computed({
    get() {
      return _currentPage.value
    },
    set(v) {
      if (!isNumber(v)) {
        console.warn(
          `[currentPage] expected number but got: '${typeof v}' value: '${v}'`,
        )
        return
      }
      // minMax를 사용하여 유효한 페이지 범위 내에서 값을 설정
      _currentPage.value = minMax(v, 1, lastPage.value)
    },
  })

  const pageSize = computed({
    get() {
      return _pageSize.value
    },
    set(v) {
      if (!isNumber(v)) {
        /* istanbul ignore else */
        console.warn(
          `[pageSize] expected number but got: '${typeof v}' value: '${v}'`,
        )
        return
      }
      _pageSize.value = v
    },
  })

  // 페이지네이션 로직 초기화 시, lastPage에 맞게 currentPage를 보정
  watch(
    [total, pageSize],
    _ => {
      // 데이터가 갱신될 때 현재 페이지가 마지막 페이지보다 크면 마지막 페이지로 이동
      if (currentPage.value > lastPage.value) {
        currentPage.value = lastPage.value
      }
    },
    { immediate: true }, // 첫 렌더링 시에도 실행하도록 수정
  )

  const prev = () => --currentPage.value
  const next = () => ++currentPage.value
  const first = () => (currentPage.value = 1)
  const last = () => (currentPage.value = lastPage.value)

  return {
    // Mutable state
    pageSize,
    total,
    currentPage,
    offset,

    // Computed
    lastPage,

    // Functions
    next,
    prev,
    first,
    last,
  }
}
