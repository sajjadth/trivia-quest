<template>
  <NuxtLoadingIndicator color="#018786" />
  <v-app>
    <div id="container">
      <Header />
      <slot />
    </div>
  </v-app>
</template>

<style lang="sass">
#container
  display: flex
  flex-direction: column
  align-items: center
  justify-content: flex-start
  width: 100%
  height: 100vh
</style>
