<template>
  <form>
    <div class="mb-3">
      <label for="title" class="form-label">제목</label>
      <input v-model="title" type="text" class="form-control" id="title" />
    </div>
    <div class="mb-3">
      <label for="content" class="form-label">내용</label>
      <textarea
        v-model="content"
        class="form-control"
        id="content"
        rows="3"
      ></textarea>
    </div>
    <div class="d-flex gap-2 mt-4">
      <slot name="acitions"></slot>
    </div>
  </form>
</template>

<script setup>
const title = defineModel('title', {
  type: String,
})

const content = defineModel('content', {
  type: String,
})
</script>

<style lang="scss" scoped></style>
