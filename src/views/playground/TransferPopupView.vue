<template>
  <div>
    <!-- Test Popup Start -->
    <Teleport to="#modal">
      <TransferPopup
        v-if="isPopupOpen"
        @close="closePopup"
        @update:items="handleUpdateItems"
      />
    </Teleport>

    <button @click="openPopup">팝업 열기</button>
    <!-- Test Popup End -->
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TransferPopup from './TransferPopup.vue'

const isPopupOpen = ref(false)
const selectedItems = ref([])

const openPopup = () => {
  isPopupOpen.value = true
}

const closePopup = () => {
  isPopupOpen.value = false
}

const handleUpdateItems = items => {
  selectedItems.value = items
}
// Test Popup End ===================================
</script>

<style lang="scss" scoped></style>
