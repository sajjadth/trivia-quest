<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script>
import {useMainStore}from "./store/index"
export default {
  setup(){
    const store = useMainStore()
    return {store: store}
  },
  mounted() {
    this.store.verifyTokenAndGetUsername()
  }
}
</script>