<template>
  <div>
    <h2>게시글 수정</h2>
    <hr class="my-4" />
    <!-- Form Start -->
    <PostForm
      @submit.prevent="edit"
      v-model:title="form.title"
      v-model:content="form.content"
    >
      <template #acitions>
        <button
          type="button"
          class="btn btn-outline-danger me-2"
          @click="goDetailPage"
        >
          취소
        </button>
        <button class="btn btn-primary" type="submit">저장</button>
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
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const id = route.params.id
const form = ref({
  title: null,
  content: null,
})

// axios start ===================================
const { sendRequest } = useAxios()

const fetchPost = async () => {
  const res = await sendRequest({
    method: 'get',
    url: `/posts/${id}`,
  })

  // 객체의 주소참조값을 다르게 하기 위해 전개복사함
  setForm(res.data)
}
// axios end ===================================

const setForm = ({ title, content }) => {
  form.value.title = title
  form.value.content = content
}

fetchPost()

// axios start ===================================
const { isLoading } = useAxios()
const { successAlert } = useAlert()

const edit = async () => {
  await sendRequest(
    {
      method: 'patch',
      url: `/posts/${id}`,
      data: form.value,
    },
    {
      onSuccess: res => {
        successAlert('수정 성공', 'success')
      },
    },
  )

  router.push({ name: 'PostDetail', params: { id: id } })
}
// axios end ===================================

const goDetailPage = () => {
  router.push({
    name: 'PostDetail',
    params: {
      id: id,
    },
  })
}
</script>

<style scoped></style>
