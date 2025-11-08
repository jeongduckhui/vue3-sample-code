<template>
  <div>
    <DisabledDatePicker ref="disabledRef" :predicate="isBeforeToday" />
    <div class="mt-2">
      <button type="button" @click="checkDisabledValue">Get Value</button>
      <span class="ml-5 text-red-400">disabledVal : {{ disabledVal }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useDatepickerInput } from '@/composables/datePicker.js'
import DisabledDatePicker from '@/components/datepicker/custom/DisabledDatePicker.vue'

// Disabled dates
const { dpRef: disabledRef, getDpInputValue: getDisabledValue } =
  useDatepickerInput()
const disabledVal = ref('')
const isBeforeToday = target => target < new Date()

// [Get Value] Button click
const checkDisabledValue = () => {
  disabledVal.value = getDisabledValue()
}
</script>
