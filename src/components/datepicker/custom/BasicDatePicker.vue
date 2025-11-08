<template>
  <DatePicker
    v-model="internalDate"
    ref="basicCal"
    :locale
    :inputFormat
    :clearable
    :weekStartsOn
    :dayFormat
  />
</template>

<script setup>
import { computed, ref } from 'vue'
import DatePicker from '../base/DatePicker.vue'
import { ko } from 'date-fns/locale'
import { format } from 'date-fns'
import { parseYYYYMMDD } from '@/utils'

const basicCal = ref(null)
const locale = ref(ko)

const propDate = defineModel('propDate', {
  type: [String, null], // 부모에서 string | null로 넘겨주므로 타입 정의를 맞춤
  required: false, // required: true면 null을 허용하지 않으므로 false로 변경
})

defineProps({
  inputFormat: { type: String },
  dayFormat: { type: String },
  clearable: { type: Boolean },
  weekStartsOn: {
    type: Number,
    validator: value => [0, 1, 2, 3, 4, 5, 6].includes(value),
  },
})

// internalDate는 Date 객체 또는 null을 저장
const internalDate = computed({
  get() {
    // propDate가 null이거나 빈 문자열이면 null을 반환하여 DatePicker를 비운다.
    if (!propDate.value) {
      return null
    }
    // propDate가 유효한 날짜 문자열이면 Date 객체로 변환
    const date = parseYYYYMMDD(propDate.value)
    // parseYYYYMMDD가 유효하지 않은 날짜를 반환하는 경우를 대비하여 체크
    return date && !isNaN(date.getTime()) ? date : null
  },
  set(newDate) {
    // newDate가 null이거나 유효하지 않으면 부모의 propDate를 null로 업데이트
    if (!newDate || isNaN(newDate.getTime())) {
      propDate.value = null
    } else {
      // 유효한 Date 객체이면 'yyyyMMdd' 형식의 문자열로 변환하여 부모에 전달
      propDate.value = format(newDate, 'yyyyMMdd')
    }
  },
})

// internalDate 값을 사용하여 현재 선택된 날짜의 문자열을 반환
const getInputValue = () => {
  if (internalDate.value) {
    return format(internalDate.value, 'yyyyMMdd')
  }

  return ''
}

defineExpose({
  getInputValue,
})
</script>
