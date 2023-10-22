<template>
  <h1>app</h1>
</template>

<script>
import { useMainStore } from "../store/index";
export default {
  setup() {
    const store = useMainStore();
    return { store: store };
  },
  beforeRouteLeave() {
    this.store.verifyTokenAndGetUsername();
  },
};
</script>
