<template>
  <div>
    <h1>포스트 목록</h1>
    <div v-if="isLoading">로딩 중...</div>
    <div v-if="error">에러: {{ error.message }}</div>
    <ul v-else>
      <li v-for="post in posts" :key="post.id">{{ post.title }}</li>
    </ul>
  </div>
</template>

<script setup>
/*
1. 컴포넌트 마운트 시 데이터 즉시 불러오기
가장 일반적인 사용 사례로, 컴포넌트가 화면에 표시될 때 즉시 API 요청을 보내 데이터를 가져옵니다.
*/
import { ref } from 'vue'
import useAxios from '@/composables/useAxios' // 경로에 맞게 수정

const posts = ref([])

// 컴포넌트 마운트 시 즉시 /api/posts로 GET 요청을 보냄
// 성공 시 posts.value에 데이터를 할당
const { isLoading, error } = useAxios(
  {
    url: '/api/posts',
    method: 'get',
  },
  {
    onSuccess: response => {
      posts.value = response.data
    },
  },
)
</script>
