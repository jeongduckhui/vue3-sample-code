<template>
  <div>
    <p>3. Disabled dates</p>
    <div class="mt-2 flex justify-center items-center">
      <DatePicker
        v-model="picked"
        ref="disabledCal"
        class="datepicker"
        :locale="locale"
        :inputFormat="inputFormat"
        :clearable="clearable"
        :weekStartsOn="weekStartsOn"
        :dayFormat="dayFormat"
        :disabled-dates="{ predicate }"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import DatePicker from '../base/DatePicker.vue'
import { ko } from 'date-fns/locale'

// props 정의
const props = defineProps({
  inputFormat: {
    type: String,
    default: 'yyyy-MM-dd',
  },
  dayFormat: {
    type: String,
    default: 'dd',
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  weekStartsOn: {
    type: Number,
    default: 1,
  },
  predicate: {
    type: Function,
    default: () => false,
  },
})

// 상태 변수 정의
const picked = ref(undefined)
const disabledCal = ref(null)
const locale = ko

// picked 값이 변경될 때마다 입력 필드에서 포커스를 해제
watch(
  () => picked.value,
  () => {
    disabledCal.value?.inputRef?.blur()
  },
)

// 부모 컴포넌트에서 접근할 수 있는 메서드 노출
const getInputValue = () => {
  return disabledCal.value?.inputRef?.value
}
defineExpose({
  getInputValue,
})
</script>

<style scoped></style>
