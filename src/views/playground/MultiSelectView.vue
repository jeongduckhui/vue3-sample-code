<template>
  <Multiselect
    v-model="selectValue"
    mode="tags"
    :close-on-select="false"
    :searchable="true"
    :create-option="true"
    :options="[
      { value: 'batman', label: 'Batman' },
      { value: 'robin', label: 'Robin' },
      { value: 'joker', label: 'Joker' },
    ]"
  />
</template>

<script setup>
import Multiselect from '@vueform/multiselect'
import { ref } from 'vue'

const selectValue = ref()
</script>

<style src="@vueform/multiselect/themes/default.css"></style>
<style lang="scss" scoped></style>
