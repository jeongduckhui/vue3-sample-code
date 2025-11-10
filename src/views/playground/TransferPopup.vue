<template>
  <!-- 배경 오버레이 트랜지션 -->
  <Transition>
    <div class="popup-overlay" @click.self="closePopup">
      <!-- 팝업 내용 트랜지션 -->
      <Transition name="bounce" appear>
        <div class="popup-content">
          <div class="popup-header">
            <h2>항목 이동</h2>
            <button class="close-btn" @click="closePopup">X</button>
          </div>
          <div class="popup-body">
            <!-- 왼쪽 영역: 소스 목록 -->
            <div class="list-area">
              <div class="list-header">
                <h3>소스 목록</h3>
                <label class="select-all-label">
                  <input
                    type="checkbox"
                    :checked="isAllLeftSelected"
                    :indeterminate="isLeftIndeterminate"
                    @change="toggleSelectAllLeft"
                    :disabled="leftItems.length === 0"
                  />
                  전체 선택
                </label>
              </div>
              <div class="list-panel">
                <div class="list-container">
                  <div
                    v-for="item in leftItems"
                    :key="item.id"
                    class="list-item"
                  >
                    <label>
                      <input
                        type="checkbox"
                        v-model="selectedLeftItems"
                        :value="item.id"
                      />
                      {{ item.name }}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- 이동 버튼 영역 -->
            <div class="transfer-buttons">
              <button
                @click="moveRight"
                :disabled="selectedLeftItems.length === 0"
              >
                &gt;
              </button>
              <button
                @click="moveLeft"
                :disabled="selectedRightItems.length === 0"
              >
                &lt;
              </button>
            </div>

            <!-- 오른쪽 영역: 대상 목록 -->
            <div class="list-area">
              <div class="list-header">
                <h3>선택 목록</h3>
                <label class="select-all-label">
                  <input
                    type="checkbox"
                    :checked="isAllRightSelected"
                    :indeterminate="isRightIndeterminate"
                    @change="toggleSelectAllRight"
                    :disabled="rightItems.length === 0"
                  />
                  전체 선택
                </label>
              </div>
              <div class="list-panel">
                <div class="list-container">
                  <div
                    v-for="item in rightItems"
                    :key="item.id"
                    class="list-item"
                  >
                    <label>
                      <input
                        type="checkbox"
                        v-model="selectedRightItems"
                        :value="item.id"
                      />
                      {{ item.name }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="popup-footer">
            <button @click="saveChanges">저장</button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, defineEmits } from 'vue'

const emits = defineEmits(['close', 'update:items'])

const initialAllItems = [
  { id: 1, name: '짬뽕' },
  { id: 2, name: '짜장면' },
  { id: 3, name: '돈까스' },
  { id: 4, name: '제육볶음' },
  { id: 5, name: '탕수육' },
  { id: 6, name: '족발' },
  { id: 7, name: '치킨' },
  { id: 8, name: '만두' },
  { id: 9, name: '햄버거' },
  { id: 10, name: '피자' },
]

const leftItems = ref([...initialAllItems])
const rightItems = ref([])
const selectedLeftItems = ref([])
const selectedRightItems = ref([])

// --- 왼쪽 목록 전체 선택/해제 로직 ---

const isAllLeftSelected = computed(() => {
  return (
    leftItems.value.length > 0 &&
    selectedLeftItems.value.length === leftItems.value.length
  )
})

const isLeftIndeterminate = computed(() => {
  return (
    selectedLeftItems.value.length > 0 &&
    selectedLeftItems.value.length < leftItems.value.length
  )
})

const toggleSelectAllLeft = event => {
  if (event.target.checked) {
    selectedLeftItems.value = leftItems.value.map(item => item.id)
  } else {
    selectedLeftItems.value = []
  }
}

// --- 오른쪽 목록 전체 선택/해제 로직 ---

const isAllRightSelected = computed(() => {
  return (
    rightItems.value.length > 0 &&
    selectedRightItems.value.length === rightItems.value.length
  )
})

const isRightIndeterminate = computed(() => {
  return (
    selectedRightItems.value.length > 0 &&
    selectedRightItems.value.length < rightItems.value.length
  )
})

const toggleSelectAllRight = event => {
  if (event.target.checked) {
    selectedRightItems.value = rightItems.value.map(item => item.id)
  } else {
    selectedRightItems.value = []
  }
}

/**
 * 왼쪽 목록에서 오른쪽 목록으로 선택된 항목을 이동.
 */
const moveRight = () => {
  const itemsToMove = leftItems.value.filter(item =>
    selectedLeftItems.value.includes(item.id),
  )
  const remainingItems = leftItems.value.filter(
    item => !selectedLeftItems.value.includes(item.id),
  )

  rightItems.value.push(...itemsToMove)
  selectedLeftItems.value = []
  leftItems.value = remainingItems
}

/**
 * 오른쪽 목록에서 왼쪽 목록으로 선택된 항목을 이동.
 */
const moveLeft = () => {
  const itemsToMove = rightItems.value.filter(item =>
    selectedRightItems.value.includes(item.id),
  )
  const remainingItems = rightItems.value.filter(
    item => !selectedRightItems.value.includes(item.id),
  )

  leftItems.value.push(...itemsToMove)
  selectedRightItems.value = []
  rightItems.value = remainingItems
}

/**
 * 팝업을 닫음.
 */
const closePopup = () => {
  emits('close')
}

/**
 * 변경사항을 저장하고 팝업을 닫음.
 */
const saveChanges = () => {
  emits('update:items', rightItems.value)
  closePopup()
}
</script>

<style scoped>
/* ---------------- Vue Transition Styles ---------------- */

/* Fade transition for the overlay background */
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.v-enter-active,
.v-leave-active {
  /* Tailwind의 transition-opacity, duration-500, ease-in-out 클래스와 유사한 효과 */
  transition: opacity 0.5s ease;
}
.v-enter-to,
.v-leave-from {
  opacity: 1;
}

/* Bounce transition for the popup content */
.bounce-enter-active {
  animation: bounce-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.bounce-leave-active {
  animation: bounce-in 0.3s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* ---------------- Existing Styles ---------------- */

/* 팝업 오버레이 */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* 팝업 내용 */
.popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 700px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.popup-body {
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
}

/* 좌우 영역 컨테이너 */
.list-area {
  width: 45%;
}

/* 목록 헤더 (제목과 체크박스 포함) */
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.list-area h3 {
  margin: 0;
}

.select-all-label {
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  color: #555;
  cursor: pointer;
}

.select-all-label input {
  margin-right: 5px;
}

/* 좌우 패널 스타일 */
.list-panel {
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  min-height: 200px;
  max-height: 300px;
  display: flex;
  flex-direction: column;
}

.list-container {
  overflow-y: auto;
}

.list-item {
  padding: 8px;
  border-bottom: 1px solid #eee;
}

.list-item:last-child {
  border-bottom: none;
}

.list-item label {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.list-item input {
  margin-right: 10px;
}

/* 이동 버튼 영역 */
.transfer-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: auto 20px;
}

.transfer-buttons button {
  padding: 8px 12px;
  cursor: pointer;
}

.popup-footer {
  text-align: right;
  border-top: 1px solid #ccc;
  padding-top: 10px;
  margin-top: 10px;
}

.popup-footer button {
  padding: 10px 20px;
  cursor: pointer;
}
</style>
