<template>
  <div>
    <h2>게시글 등록</h2>
    <hr class="my-4" />
    <!-- Form Start -->
    <PostForm
      @submit.prevent="save"
      v-model:title="form.title"
      v-model:content="form.content"
    >
      <template #acitions>
        <button type="button" class="btn btn-outline-dark" @click="goListPage">
          목록
        </button>

        <button class="btn btn-primary" type="submit" :disabled="isLoading">
          <template v-if="isLoading">
            <span
              class="spinner-grow spinner-grow-sm"
              aria-hidden="true"
            ></span>
            <span class="visually-hidden" role="status">Loading...</span>
          </template>
          <template v-else>저장</template>
        </button>
      </template>
    </PostForm>
    <!-- Form End -->
  </div>
</template>

<script setup>
import PostForm from '@/components/posts/PostForm.vue'
import { useAlert } from '@/composables/alert'
import useAxios from '@/composables/axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = ref({
  title: null,
  content: null,
})

// axios start ===================================
const { isLoading, sendRequest } = useAxios()
const { successAlert } = useAlert()

const save = async () => {
  const saveData = {
    ...form.value,
    createdAt: Date.now(),
  }

  await sendRequest(
    {
      method: 'post',
      url: '/posts',
      data: saveData,
    },
    {
      onSuccess: res => {
        successAlert('등록 성공', 'success')
      },
    },
  )

  router.push({ name: 'PostList' })
}
// axios end ===================================

const goListPage = () => {
  router.push({
    name: 'PostList',
  })
}
</script>

<style scoped></style>
