<template>
  <Transition>
    <!-- v-if="modelValue"는 모달이 보일 때만 렌더링되도록 합니다 -->
    <div v-if="modelValue">
      <!-- modal-backdrop: 배경 오버레이를 위한 Tailwind 클래스 -->
      <!-- fixed inset-0는 전체 화면을 덮습니다. bg-black opacity-50은 어두운 반투명 배경을 만듭니다. -->
      <div class="fixed inset-0 bg-black opacity-50"></div>

      <!-- modal, modal fade show d-block: 모달 컨테이너를 위한 Tailwind 클래스 -->
      <!-- fixed inset-0 flex items-center justify-center는 모달을 화면 중앙에 배치합니다. -->
      <!-- overflow-y-auto는 내용이 길어질 경우 스크롤을 허용합니다. -->
      <div
        class="fixed inset-0 flex items-center justify-center overflow-y-auto z-50"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <!-- modal-dialog: 모달 콘텐츠의 위치와 크기를 조절하는 Tailwind 클래스 -->
        <!-- p-4는 패딩을 제공하고, w-full max-w-lg mx-auto는 너비를 설정합니다. -->
        <div class="p-4 w-full max-w-lg mx-auto">
          <!-- modal-content: 모달 내부의 흰색 박스 스타일링 -->
          <!-- bg-white rounded-lg shadow-lg flex flex-col overflow-hidden -->
          <div
            class="bg-white rounded-lg shadow-lg flex flex-col overflow-hidden"
          >
            <!-- modal-header: 헤더 스타일링 -->
            <!-- p-4 flex justify-between items-center border-b border-gray-200 -->
            <div
              class="p-4 flex justify-between items-center border-b border-gray-200"
            >
              <slot name="header">
                <!-- modal-title: 제목 스타일링 -->
                <h5 class="text-xl font-semibold" id="exampleModalLabel">
                  {{ title }}
                </h5>
                <!-- btn-close: 닫기 버튼 스타일링 -->
                <!-- text-gray-500 hover:text-gray-700 text-2xl font-bold cursor-pointer -->
                <button
                  type="button"
                  class="text-gray-500 hover:text-gray-700 text-2xl font-bold cursor-pointer leading-none"
                  aria-label="Close"
                  @click="$emit('update:modelValue', false)"
                >
                  <!-- 간단한 X 아이콘 표현 -->
                  &times;
                </button>
              </slot>
            </div>
            <!-- modal-body: 본문 스타일링 -->
            <!-- p-4 -->
            <div class="p-4">
              <slot></slot>
            </div>
            <!-- modal-footer: 푸터 스타일링 -->
            <!-- p-4 flex justify-end border-t border-gray-200 -->
            <div class="p-4 flex justify-end border-t border-gray-200">
              <slot name="actions"></slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  title: String,
})
defineEmits(['close', 'update:modelValue'])
</script>

<style scoped>
/* Vue Transition 클래스는 Tailwind CSS 유틸리티와 독립적으로 작동합니다. */
/* Tailwind는 기본적으로 opacity 유틸리티를 제공합니다. */

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
</style>
