<template>
  <div>
    <ul class="nav nav-pills">
      <li class="nav-item">
        <RouterLink
          class="nav-link"
          active-class="active"
          to="/playground/basic"
        >
          Basic DatePicker
        </RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink
          class="nav-link"
          active-class="active"
          to="/playground/upperlower"
        >
          Upper and Lower DatePicker
        </RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink
          class="nav-link"
          active-class="active"
          to="/playground/disabled"
        >
          Disabled DatePicker
        </RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink
          class="nav-link"
          active-class="active"
          to="/playground/vuepic"
        >
          Vuepic DatePicker
        </RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink
          class="nav-link"
          active-class="active"
          to="/playground/multiselect"
        >
          Multi Select
        </RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink
          class="nav-link"
          active-class="active"
          to="/playground/datagrid"
        >
          Vue DataGrid
        </RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink
          class="nav-link"
          active-class="active"
          to="/playground/transferpopup"
        >
          Transfer Popup
        </RouterLink>
      </li>
    </ul>
    <hr cl="my-4" />
    <RouterView></RouterView>
  </div>
</template>

<script setup>
// Nested 탭 클릭 시 바로 NestedOneView로 이동
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  router.push('/playground/basic')
})
</script>

<style scoped></style>
