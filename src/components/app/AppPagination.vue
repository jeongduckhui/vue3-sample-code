<template>
  <nav class="mt-5" aria-label="Page navigation example">
    <ul class="pagination justify-content-center">
      <li class="page-item" :class="{ disabled: !(currentPage > 1) }">
        <a
          class="page-link"
          href="#"
          aria-label="Previous"
          @click.prevent="
            () => {
              // prev() 함수를 호출하면 currentPage값이 -1 됨
              prev()
              // currentPage 값이 변경되면 리스트 재조회를 위해 부모에게 갱신된 currentPage값을 넘겨줘야 함
              $emit('currentPage', currentPage)
            }
          "
        >
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li
        v-for="page in lastPage"
        :key="page"
        class="page-item"
        :class="{ active: currentPage === page }"
      >
        <a
          class="page-link"
          href="#"
          @click.prevent="
            () => {
              // currentPage 변수가 반응성을 가지고 있는 메인 변수임. 페이지 변경 시 값을 갱신해줘야 페이징이 오류없이 동작함
              currentPage = page
              // 현재 페이지를 부모에 넘겨야만 페이지 클릭할 때 페이지에 맞게 재조회할 수 있음
              $emit('currentPage', currentPage)
            }
          "
        >
          {{ page }}
        </a>
      </li>
      <li class="page-item" :class="{ disabled: !(currentPage < lastPage) }">
        <a
          class="page-link"
          href="#"
          aria-label="Next"
          @click.prevent="
            () => {
              // next() 함수를 호출하면 currentPage값이 +1 됨
              next()
              // currentPage 값이 변경되면 리스트 재조회를 위해 부모에게 갱신된 currentPage값을 넘겨줘야 함
              $emit('currentPage', currentPage)
            }
          "
        >
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { usePagination } from '@/composables/pagination'
import { isNumber } from '@/utils'
import { computed } from 'vue'

// pagination에서 사용하는 변수 타입은 Number 임
// String으로 넘어오는 경우 props에서는 String 타입을 허용하고
// props로 받은 값을 computed를 통해 Number 타입으로 변경
const props = defineProps({
  pageSize: {
    type: [Number, String],
    required: true,
  },
  totalCount: {
    type: [Number, String],
    required: true,
  },
})

defineEmits(['currentPage'])

// pagination에서 사용하는 변수 타입은 Number 임
// String 타입이 넘어오는 경우 computed로 타입 Number로 변경
const pageSize = computed(() => {
  return isNumber(props.pageSize) ? props.pageSize : parseInt(props.pageSize)
})

const totalCount = computed(() => {
  return isNumber(props.totalCount)
    ? props.totalCount
    : parseInt(props.totalCount)
})

const { next, prev, currentPage, lastPage } = usePagination({
  currentPage: 1,
  pageSize: computed(() => pageSize.value), // 페이지 사이즈가 고정일 경우, comuted로 처리할 필요없이 숫자 고정하면 됨
  total: computed(() => totalCount.value),
})
</script>

<style lang="scss" scoped></style>
