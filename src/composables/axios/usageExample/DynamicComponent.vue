<template>
  <div>
    <h1>사용자 상세 정보</h1>
    <input type="number" v-model="userId" placeholder="사용자 ID 입력" />
    <div v-if="isLoading">사용자 정보 로딩 중...</div>
    <div v-if="error">에러: {{ error.message }}</div>
    <div v-else-if="user">
      <p>이름: {{ user.name }}</p>
      <p>이메일: {{ user.email }}</p>
    </div>
  </div>
</template>

<script setup>
/*
2. URL이 변경될 때마다 자동으로 데이터 다시 불러오기
ref 변수로 관리되는 URL이 변경될 때마다 자동으로 API 요청을 보내는 경우입니다. useAxios는 URL의 반응성을 감지하여 watch로 처리합니다.

*/
import { ref } from 'vue'
import useAxios from '@/composables/useAxios' // 경로에 맞게 수정

const userId = ref(1) // 동적 URL에 사용될 반응형 변수
const user = ref(null)

// userId가 변경될 때마다 즉시 /api/users/{userId}로 요청
const { isLoading, error } = useAxios(
  {
    // URL을 ref 객체로 전달
    url: ref(`/api/users/${userId.value}`),
    method: 'get',
  },
  {
    onSuccess: response => {
      user.value = response.data
    },
  },
)
</script>
