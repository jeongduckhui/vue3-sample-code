<script setup>
import TheHeader from './layouts/TheHeader.vue'
import TheView from './layouts/TheView.vue'
import AppLoadingSpinner from './components/app/AppLoadingSpinner.vue'
import { useLoading } from './composables/loading'

const { isLoading } = useLoading()
</script>

<template>
  <TheHeader></TheHeader>
  <TheView></TheView>
  <AppAlert />
  <AppLoadingSpinner :loading="isLoading" />
</template>
