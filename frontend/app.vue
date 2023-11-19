<template>
  <v-snackbar
    timeout="2500"
    variant="flat"
    :color="store.snackbar.color"
    v-model="store.snackbar.stat"
    location="top center"
    rounded="lg"
  >
    {{ store.snackbar.message }}

    <template v-slot:actions>
      <v-btn variant="text" rounded @click="store.closeSnackbar">
        <span class="mdi mdi-close"></span>
      </v-btn>
    </template>
  </v-snackbar>
  <loading v-if="store.loading" />
  <NuxtLayout v-else>
    <NuxtPage />
  </NuxtLayout>
</template>

<script>
import { useMainStore } from "./store/index";
export default {
  setup() {
    const store = useMainStore();
    return { store: store };
  },
  mounted() {
    this.store.checkBackendStatus();
  },
};
</script>
