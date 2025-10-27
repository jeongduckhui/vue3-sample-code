<template>
  <div>
    <h1>데이터 수동 요청</h1>
    <button @click="fetchData" :disabled="isLoading">
      {{ isLoading ? '로딩 중...' : '데이터 불러오기' }}
    </button>
    <div v-if="error">에러: {{ error.message }}</div>
    <div v-if="data">성공적으로 데이터를 불러왔습니다.</div>
  </div>
</template>

<script setup>
/*
3. 사용자 인터랙션에 따라 수동으로 요청 보내기
버튼 클릭과 같은 특정 이벤트가 발생했을 때만 API 요청을 보내야 하는 경우입니다.
이 경우에는 useAxios에 immediateConfig를 전달하지 않고 sendRequest 함수만 사용합니다.
*/
import { ref } from 'vue'
import useAxios from '@/composables/useAxios' // 경로에 맞게 수정

const data = ref(null)
const { isLoading, error, sendRequest } = useAxios() // immediateConfig를 null로 전달

const fetchData = async () => {
  try {
    const response = await sendRequest(
      {
        url: '/api/manual-data',
        method: 'get',
      },
      // 에러를 직접 처리하고 싶을 때 throwOnError 옵션 사용
      { throwOnError: true },
    )
    data.value = response.data
  } catch (err) {
    // throwOnError: true일 때 여기서 에러를 잡을 수 있음
    console.error('수동 요청 실패:', err.message)
  }
}
</script>
