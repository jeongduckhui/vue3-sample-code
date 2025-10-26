<template>
  <AppModal v-model="show" title="게시글">
    <template #default>
      <div class="row g-3">
        <div class="col-3 text-muted">제목</div>
        <div class="col-9">{{ title }}</div>
        <div class="col-3 text-muted">내용</div>
        <div class="col-9">{{ content }}</div>
        <div class="col-3 text-muted">등록일</div>
        <div class="col-9">
          {{ $dayjs(createdAt).format('YYYY. MM. DD HH:mm:ss') }}
        </div>
      </div>
    </template>
    <template #actions>
      <button type="button" class="btn btn-secondary" @click="closeModal">
        닫기
      </button>
    </template>
  </AppModal>
</template>

<script setup>
const props = defineProps({
  title: String,
  content: String,
  createdAt: [String, Number],
})

const show = defineModel({ type: Boolean })

const closeModal = () => (show.value = false)
</script>

<style lang="scss" scoped></style>
