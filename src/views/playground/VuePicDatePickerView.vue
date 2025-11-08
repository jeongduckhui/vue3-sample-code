<template>
  <VueDatePicker
    v-model="dates"
    :locale="ko"
    range
    multi-calendars
    class="custom-datepicker"
  />
  <hr />
  <VueDatePicker v-model="weekDate" :locale="ko" week-picker />
</template>

<script setup>
import { VueDatePicker } from '@vuepic/vue-datepicker'

import { inject, ref, watch } from 'vue'
import { ko } from 'date-fns/locale'

const dates = ref()
const dayjs = inject('dayjs')

watch(dates, (newVal, oldVal) => {
  console.log('newVal[0]: ', newVal[0])
  console.log('newVal[1]: ', newVal[1])
  console.log('newVal[0]: ', dayjs(newVal[0]).format('YYYY. MM. DD HH:mm:ss'))
  console.log('newVal[1]: ', dayjs(newVal[1]).format('YYYY. MM. DD HH:mm:ss'))
  // dayjs(props.createdAt).format('YYYY. MM. DD HH:mm:ss')
  // console.log('oldVal: ', oldVal)
})

const weekDate = ref()
</script>

<style scoped>
.custom-datepicker {
  /* 입력 필드의 너비 조절 */
  width: 250px; /* 원하는 너비로 설정 */
}

/* 달력 팝업 및 내부 요소들의 크기 조절 */
:root {
  --dp-font-size: 0.9rem; /* 폰트 크기 줄이기 */
  --dp-menu-min-width: 280px; /* 팝업 최소 너비 설정 */
  --dp-cell-size: 35px; /* 달력 셀 크기 조절 */
  --dp-input-padding: 8px 30px 8px 12px; /* 입력창 패딩 조절 */
}

/* :root에 설정된 변수가 전역에 영향을 미치는 것이 싫다면,
   .custom-datepicker 클래스 하위에서 변수를 재정의할 수 있습니다. */
/*
.custom-datepicker :deep(.dp__menu) {
  --dp-font-size: 0.9rem;
  --dp-menu-min-width: 280px;
  --dp-cell-size: 35px;
}
*/
</style>
