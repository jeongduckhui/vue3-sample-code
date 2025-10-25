import { isNumber, minMax, wrap } from '@/utils'
import { computed, ref, watch } from 'vue'

/**
 * Create a pagination controller based on the arguments
 * @param options - pageSize, total, currentPage
 */
export function usePagination(options) {
  const _currentPage = wrap(options.currentPage)
  const _pageSize = wrap(options.pageSize)
  const _offset = ref(0)
  const total = wrap(options.total)

  const offset = computed({
    get() {
      return _offset.value
    },
    set(v) {
      if (!isNumber(v)) {
        console.warn(
          `[offset] expected number but got: '${typeof v}' value: '${v}'`,
        )
        return
      }
      _offset.value = Math.min(v, total.value)
    },
  })

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
      // 아래 원본 구문 주석으로 막음. 원본대로 하면 currentPage가 최초 0으로 반환되어 화면 로딩될 때 페이지가 1로 바인딩되지 않음
      // 아래 원본 구문 주석으로 막아서 offset값이 정상적으로 계산되지 않더라도 offset은 사용하지 않기 때문에 문제 없을 듯
      // _currentPage.value = minMax(v, 1, lastPage.value)
      _currentPage.value = v
      // set the offset
      offset.value = (_currentPage.value - 1) * pageSize.value
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

  const lastPage = computed(() => Math.ceil(total.value / pageSize.value))
  // make sure the current page is the correct value
  currentPage.value = _currentPage.value

  const prev = () => --currentPage.value
  const next = () => ++currentPage.value
  const first = () => (currentPage.value = 1)
  const last = () => (currentPage.value = lastPage.value)

  watch(
    [total, pageSize],
    _ => {
      if (currentPage.value > lastPage.value) {
        currentPage.value = lastPage.value
      }
    },
    { immediate: false }, // no need to run on first render
  )

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
