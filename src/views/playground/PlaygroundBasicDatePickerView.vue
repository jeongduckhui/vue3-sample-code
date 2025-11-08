<template>
  <div>
    <BasicDatePicker
      ref="basicRef"
      v-model:propDate="basicDate"
      :dayFormat="basicDayFormat"
      :clearable="true"
      :weekStartsOn="basicStartWeekDay"
    />
  </div>
  <button type="button" @click="checkBasicValue">Get Value</button>
  <p>{{ basicDpVal }}</p>
</template>

<script setup>
import { useDatepickerInput } from '@/composables/datePicker.js'
import { ref } from 'vue'
import BasicDatePicker from '@/components/datepicker/custom/BasicDatePicker.vue'

const { dpRef: basicRef, getDpInputValue: getBasicValue } = useDatepickerInput()
const basicDate = ref(null)
const basicDayFormat = 'd'
const basicStartWeekDay = ref(0)
const basicDpVal = ref('')

const checkBasicValue = () => {
  basicDpVal.value = getBasicValue()
}

// 이건 커스텀 스타일 적용 시 바인딩하는 방법
const inputStyle = {
  backgroundColor: '#e0e0ff',
  color: '#00008b',
  border: '2px solid #00008b',
  borderRadius: '4px',
  padding: '8px',
  '--vdp-hover-color': 'red',
}
</script>

<style scoped></style>
