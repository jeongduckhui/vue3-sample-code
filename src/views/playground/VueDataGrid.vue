<template>
  <div>
    <vue3-datatable
      ref="datatable"
      :rows="rows"
      :columns="cols"
      :loading="loading"
      :hasCheckbox="true"
      :selectRowOnClick="true"
      :sortable="true"
      :columnFilter="true"
    >
    </vue3-datatable>
  </div>
</template>
<script setup>
import { onMounted, ref, toRaw } from 'vue'
import Vue3Datatable from '@bhplugin/vue3-datatable'
import '@bhplugin/vue3-datatable/dist/style.css'

onMounted(() => {
  // getUsers()
})

const loading = ref(true)
const datatable = ref(null)
const rows = ref(null)
const cols =
  ref([
    { field: 'id', title: 'ID', isUnique: true, type: 'number' },
    { field: 'firstName', title: 'First Name' },
    { field: 'lastName', title: 'Last Name' },
    { field: 'email', title: 'Email' },
    { field: 'age', title: 'Age', type: 'number' },
    { field: 'dob', title: 'Birthdate', type: 'date' },
    { field: 'address.city', title: 'City' },
    { field: 'isActive', title: 'Active', type: 'bool' },
  ]) || []
</script>
<style>
.bh-datatable .bh-table-responsive {
  @apply min-h-[380px];
}
</style>
