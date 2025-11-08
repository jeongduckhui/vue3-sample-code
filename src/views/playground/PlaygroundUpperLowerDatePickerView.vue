<template>
  <div>
    <UpperLowerDatePicker ref="limitsRef" :fromDate :toDate />
    <div class="mt-2">
      <button type="button" @click="checkLimitsValue">Get Value</button>
      <span class="ml-5 text-purple-400">limitsVal : {{ limitsVal }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { format, add, sub } from 'date-fns'
import { useDatepickerInput } from '@/composables/datePicker.js'

import UpperLowerDatePicker from '@/components/datepicker/custom/UpperLowerDatePicker.vue'

// Upper and lower limits
const { dpRef: limitsRef, getDpInputValue: getLimitsValue } =
  useDatepickerInput()
const limitsVal = ref('') // 타입스크립트 없이 사용하므로 `ref('')`로 초기화
const fromDate = format(sub(new Date(), { days: 3 }), 'yyyyMMdd')
const toDate = format(add(new Date(), { days: 3 }), 'yyyyMMdd')

// [Get Value] Button click
const checkLimitsValue = () => {
  limitsVal.value = getLimitsValue()
}
</script>
