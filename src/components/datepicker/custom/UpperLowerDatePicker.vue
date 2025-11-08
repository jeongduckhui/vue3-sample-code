<template>
  <div>
    <p>2. Upper and lower limits</p>
    <div class="mt-2 flex items-center justify-center">
      <div>
        <div class="date">
          <span class="from-to">From:</span>
          <DatePicker
            v-model="fromPicked"
            class="datepicker"
            :locale
            :inputFormat
            :weekStartsOn
            :dayFormat
          />
        </div>
        <div class="date mt-1">
          <span class="from-to">To:</span>
          <DatePicker
            v-model="toPicked"
            class="datepicker"
            :locale
            :inputFormat
            :weekStartsOn
            :dayFormat
          />
        </div>
      </div>
      <div class="ml-4">=></div>
      <div class="date">
        <DatePicker
          v-model="limitsPicked"
          ref="limitsCal"
          class="datepicker"
          :locale
          :inputFormat
          :clearable="true"
          :weekStartsOn
          :dayFormat
          :lower-limit="fromPicked"
          :upper-limit="toPicked"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import DatePicker from '../base/DatePicker.vue'
import { ko } from 'date-fns/locale'
import { parseISO, format } from 'date-fns' // format 함수 추가

// props 정의
const props = defineProps({
  fromDate: {
    type: String,
    default: '',
  },
  toDate: {
    type: String,
    default: '',
  },
  inputFormat: {
    type: String,
    default: 'yyyy-MM-dd',
  },
  dayFormat: {
    type: String,
    default: 'dd',
  },
  weekStartsOn: {
    type: Number,
    default: 1,
  },
})

const fromPicked = ref(null)
const toPicked = ref(null)
const limitsPicked = ref(null)
const locale = reactive(ko)

const limitsCal = ref()
watch(limitsPicked, () => {
  if (limitsCal.value?.inputRef) {
    limitsCal.value.inputRef.blur()
  }
})

// 부모에게 노출할 함수: limitsPicked 값을 'yyyy-MM-dd' 형식으로 포맷하여 반환
const getInputValue = () => {
  if (limitsPicked.value) {
    return format(limitsPicked.value, 'yyyy-MM-dd')
  }
  return ''
}

defineExpose({
  getInputValue,
})

onMounted(() => {
  if (props.fromDate) {
    fromPicked.value = parseISO(props.fromDate)
  }
  if (props.toDate) {
    toPicked.value = parseISO(props.toDate)
  }
})
</script>
