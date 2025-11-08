<template>
  <div class="search-form-container">
    <!-- 검색어 입력 필드 -->
    <div class="input-group">
      <label for="search-term">검색어:</label>
      <input
        id="search-term"
        v-model="searchTerm"
        type="text"
        placeholder="검색어를 입력하세요"
        class="search-input"
      />
    </div>

    <!-- 날짜 선택기 -->
    <div class="input-group">
      <label for="date-range">기간:</label>
      <DatePicker
        v-model="dateRange"
        range
        :enable-time-picker="false"
        class="search-datepicker"
      />
    </div>

    <!-- 조회 버튼 -->
    <div class="button-group">
      <button @click="handleSearch" class="search-button">조회</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import DatePicker from '@/components/datepicker/base/DatePicker.vue'

// DatePicker의 v-model을 위한 상태
const dateRange = ref()
// Input 필드의 v-model을 위한 상태
const searchTerm = ref('')

// `handleSearch` 이벤트를 부모 컴포넌트로 내보냅니다.
const emit = defineEmits(['search'])

// 조회 버튼 클릭 이벤트 핸들러
const handleSearch = () => {
  // 부모 컴포넌트에 이벤트와 데이터를 전달합니다.
  emit('search', {
    searchTerm: searchTerm.value,
    dateRange: dateRange.value,
  })
}

// 날짜 범위 값이 변경될 때마다 콘솔에 기록하여 확인
watch(dateRange, newVal => {
  console.log('선택된 날짜 범위:', newVal)
})
</script>

<style scoped>
.search-form-container {
  display: flex;
  gap: 15px;
  align-items: flex-end;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-group label {
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

.search-input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 250px;
}

.search-datepicker {
  width: 250px;
}

.search-button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.search-button:hover {
  background-color: #0056b3;
}
</style>
