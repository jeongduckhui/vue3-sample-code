<template>
  <div>
    <ul class="nav nav-pills">
      <li class="nav-item">
        <RouterLink class="nav-link" active-class="active" to="/nested/one">
          Nested One
        </RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink class="nav-link" active-class="active" to="/nested/two">
          Nested Two
        </RouterLink>
      </li>
    </ul>
    <hr cl="my-4" />
    <RouterView></RouterView>
  </div>
</template>

<script setup>
/*
// Nested 탭 클릭 시 바로 NestedOneView로 이동
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  router.push('/nested/one')
})
*/
</script>

<style scoped></style>
