<template>
  <form @submit.prevent>
    <div class="row g-3">
      <div class="col">
        <input
          v-model.lazy="title"
          type="text"
          class="form-control"
          placeholder="제목으로 검색해주세요"
        />
      </div>
      <div class="col">
        <select v-model="limit" class="form-select">
          <option value="3">3개씩 보기</option>
          <option value="6">6개씩 보기</option>
          <option value="9">9개씩 보기</option>
        </select>
      </div>
    </div>
  </form>
</template>

<script setup>
const title = defineModel('title', { type: String })
const limit = defineModel('limit', { type: [String, Number], default: 3 })
</script>

<style scoped></style>
