<template>
  <NuxtLoadingIndicator color="#018786" />
  <v-app>
    <div class="w-100 h-100 d-flex flex-column align-center justify-start">
      <Header />
      <slot />
    </div>
  </v-app>
</template>
