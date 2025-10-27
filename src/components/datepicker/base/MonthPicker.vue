<template>
  <picker-popup
    headingClickable
    :columnCount="3"
    :items="months"
    :leftDisabled="leftDisabled"
    :rightDisabled="rightDisabled"
    viewMode="month"
    @left="previousPage"
    @right="nextPage"
    @heading="$emit('back')"
    @elementClick="$emit('select', $event)"
  >
    <template #heading>{{ heading }}</template>
  </picker-popup>
</template>

<script>
import { defineComponent, computed, ref, watchEffect } from 'vue'
import {
  startOfYear,
  endOfYear,
  eachMonthOfInterval,
  getMonth,
  getYear,
  subYears,
  addYears,
  format,
  isSameMonth,
  isBefore,
  isAfter,
  isSameYear,
  startOfMonth,
  endOfMonth,
  isValid,
  format as formatDate,
} from 'date-fns'
import PickerPopup from './PickerPopup.vue'

export default defineComponent({
  components: {
    PickerPopup,
  },
  emits: {
    'update:pageDate': date => isValid(date),
    select: date => isValid(date),
    back: () => true,
  },
  props: {
    /**
     * Currently selected date, needed for highlighting
     */
    selected: {
      type: Date,
      required: false,
    },
    pageDate: {
      type: Date,
      required: true,
    },
    format: {
      type: String,
      required: false,
      default: 'LLL',
    },
    locale: {
      type: Object,
      required: false,
    },
    lowerLimit: {
      type: Date,
      required: false,
    },
    upperLimit: {
      type: Date,
      required: false,
    },
  },
  setup(props, { emit }) {
    const from = computed(() => startOfYear(props.pageDate))
    const to = computed(() => endOfYear(props.pageDate))

    const format = computed(
      () => value =>
        formatDate(value, props.format, {
          locale: props.locale,
        }),
    )

    const isEnabled = (target, lower, upper) => {
      if (!lower && !upper) return true
      if (lower && isBefore(target, startOfMonth(lower))) return false
      if (upper && isAfter(target, endOfMonth(upper))) return false
      return true
    }

    const months = computed(() =>
      eachMonthOfInterval({
        start: from.value,
        end: to.value,
      }).map(value => ({
        value,
        display: format.value(value),
        key: format.value(value),
        selected: !!props.selected && isSameMonth(props.selected, value),
        disabled: !isEnabled(value, props.lowerLimit, props.upperLimit),
      })),
    )

    const heading = computed(() => getYear(from.value))

    const leftDisabled = computed(
      () =>
        props.lowerLimit &&
        (isSameYear(props.lowerLimit, props.pageDate) ||
          isBefore(props.pageDate, props.lowerLimit)),
    )
    const rightDisabled = computed(
      () =>
        props.upperLimit &&
        (isSameYear(props.upperLimit, props.pageDate) ||
          isAfter(props.pageDate, props.upperLimit)),
    )

    const previousPage = () =>
      emit('update:pageDate', subYears(props.pageDate, 1))
    const nextPage = () => emit('update:pageDate', addYears(props.pageDate, 1))

    return {
      months,
      heading,
      leftDisabled,
      rightDisabled,
      previousPage,
      nextPage,
    }
  },
})
</script>
