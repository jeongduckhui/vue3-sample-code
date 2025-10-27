<template>
  <picker-popup
    headingClickable
    :columnCount="2"
    :leftDisabled="true"
    :rightDisabled="true"
    viewMode="time"
    @heading="$emit('back')"
  >
    <template #heading
      >{{ padStartZero(hours) }}:{{ padStartZero(minutes) }}</template
    >
    <template #body>
      <div ref="hoursListRef" class="v3dp__column">
        <button
          v-for="item in hoursList"
          :key="item.value"
          :ref="item.ref"
          :class="[{ selected: item.selected }, 'v3dp__element_button__hour']"
          :disabled="!isEnabled(item.date)"
          @click.stop.prevent="hours = item.value"
        >
          <span>{{ padStartZero(item.value) }}</span>
        </button>
      </div>
      <div ref="minutesListRef" class="v3dp__column">
        <button
          v-for="item in minutesList"
          :key="item.value"
          :ref="item.ref"
          :class="[{ selected: item.selected }, 'v3dp__element_button__minute']"
          :disabled="!isEnabled(item.date)"
          @click.stop.prevent="selectMinutes(item)"
        >
          <span>{{ padStartZero(item.value) }}</span>
        </button>
      </div>
    </template>
  </picker-popup>
</template>

<script>
import { defineComponent, computed, ref, watch, nextTick } from 'vue'
import { isSameHour, isSameMinute, isValid, set } from 'date-fns'
import PickerPopup from '../../datepicker/base/PickerPopup.vue'

function scrollParentToChild(parent, child) {
  const parentRect = parent.getBoundingClientRect()
  const parentViewableArea = {
    height: parent.clientHeight,
    width: parent.clientWidth,
  }

  const childRect = child.getBoundingClientRect()
  const isViewable =
    childRect.top >= parentRect.top &&
    childRect.bottom <= parentRect.top + parentViewableArea.height

  if (!isViewable) {
    const scrollTop = childRect.top - parentRect.top
    const scrollBot = childRect.bottom - parentRect.bottom
    if (Math.abs(scrollTop) < Math.abs(scrollBot)) {
      parent.scrollTop += scrollTop
    } else {
      parent.scrollTop += scrollBot
    }
  }
}

export default defineComponent({
  components: {
    PickerPopup,
  },
  emits: {
    select: date => isValid(date),
    back: () => true,
  },
  props: {
    selected: {
      type: Date,
      required: false,
    },
    pageDate: {
      type: Date,
      required: true,
    },
    visible: {
      type: Boolean,
      required: true,
    },
    disabledTime: {
      type: Object,
      required: false,
    },
  },
  setup(props, { emit }) {
    const hoursListRef = ref(null)
    const minutesListRef = ref(null)

    const currentDate = computed(() => props.pageDate ?? props.selected)

    const hours = ref(currentDate.value.getHours())
    const minutes = ref(currentDate.value.getMinutes())

    watch(
      () => props.selected,
      value => {
        let newHours = 0
        let newMinutes = 0

        if (value) {
          newHours = value.getHours()
          newMinutes = value.getMinutes()
        }

        hours.value = newHours
        minutes.value = newMinutes
      },
    )

    const hoursList = computed(() =>
      [...Array(24).keys()].map(value => ({
        value,
        date: set(new Date(currentDate.value.getTime()), {
          hours: value,
          minutes: minutes.value,
          seconds: 0,
        }),
        selected: hours.value === value,
        ref: ref(null),
      })),
    )
    const minutesList = computed(() =>
      [...Array(60).keys()].map(value => ({
        value,
        date: set(new Date(currentDate.value.getTime()), {
          hours: hours.value,
          minutes: value,
          seconds: 0,
        }),
        selected: minutes.value === value,
        ref: ref(null),
      })),
    )

    const selectMinutes = item => {
      minutes.value = item.value

      emit('select', item.date)
    }

    const scroll = () => {
      const currentHour = hoursList.value.find(
        item => item.ref.value?.classList?.contains('selected') ?? false,
      )
      const currentMinute = minutesList.value.find(
        item => item.ref.value?.classList?.contains('selected') ?? false,
      )

      if (currentHour && currentMinute) {
        scrollParentToChild(hoursListRef.value, currentHour.ref.value)
        scrollParentToChild(minutesListRef.value, currentMinute.ref.value)
      }
    }

    watch(
      () => props.visible,
      visible => {
        if (visible) {
          nextTick(scroll)
        }
      },
    )

    const isEnabled = target => {
      if (
        props.disabledTime?.dates?.some(
          date => isSameHour(target, date) && isSameMinute(target, date),
        )
      ) {
        return false
      }
      if (props.disabledTime?.predicate?.(target)) return false
      return true
    }

    const padStartZero = item => `0${item}`.substr(-2)

    return {
      hoursListRef,
      minutesListRef,
      hours,
      minutes,
      hoursList,
      minutesList,
      padStartZero,
      selectMinutes,
      isEnabled,
      scroll,
    }
  },
})
</script>

<style scoped>
.v3dp__column {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 190px;
}
</style>
