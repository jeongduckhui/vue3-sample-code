<template>
  <div>
    <h1>취소 가능한 요청</h1>
    <button @click="startRequest" :disabled="isLoading">요청 시작</button>
    <button @click="cancelRequest" :disabled="!isLoading">요청 취소</button>
    <div v-if="isLoading">로딩 중...</div>
    <div v-if="error">에러: {{ error.message }}</div>
    <div v-if="data">데이터: {{ data }}</div>
  </div>
</template>

<script setup>
/*
4. 요청 취소하기
사용자가 요청을 취소하고 싶거나 컴포넌트가 언마운트될 때 요청을 중단해야 할 때 cancelRequest를 사용합니다.
*/
import { ref } from 'vue'
import useAxios from '@/composables/useAxios' // 경로에 맞게 수정

const data = ref(null)
const { isLoading, error, sendRequest, cancelRequest } = useAxios()

const startRequest = async () => {
  try {
    // 가상의 느린 API 요청
    const response = await sendRequest({ url: '/api/slow-data' })
    data.value = response.data
  } catch (err) {
    // 요청이 취소되면 AbortError가 발생하지만,
    // useAxios 내부에서 처리되므로 여기서는 잡히지 않음
    console.error('요청 실패:', err.message)
  }
}
</script>
