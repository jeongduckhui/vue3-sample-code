<template>
  <div class="app-alert">
    <transition-group name="slide">
      <div
        v-for="({ id, message, type }, index) in alerts"
        :key="id"
        class="alert"
        :class="typeStyle(type)"
        role="alert"
      >
        {{ message }}
        <!-- 닫기 버튼 클릭 시 removeAlert 함수 호출 -->
        <button type="button" @click="removeAlert(id)">닫기</button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useAlert } from '@/composables/alert'

// useAlert 컴포저블에서 alerts와 removeAlert를 가져옵니다.
const { alerts, removeAlert } = useAlert()
const typeStyle = type => (type === 'error' ? 'alert-danger' : 'alert-primary')
</script>

<style scoped>
.app-alert {
  position: fixed;
  top: 10px;
  right: 10px;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease;
}
.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  transform: translateY(0px);
}
</style>
