<template>
  <!-- Main layout container using NuxtLayout -->
  <NuxtLayout>
    <!-- Container with full width, centered, and vertically aligned content -->
    <v-container
      fluid
      class="w-100 d-flex flex-column align-center justify-center"
    >
      <!-- Heading for the page -->
      <h1 class="text-h1 pa-5">Oops!</h1>
      <!-- Message for the not-found scenario -->
      <p class="text-body-1 text-center" id="not-found-message">
        It seems like you've taken a wrong turn. The page you're looking for
        isn't here. Don't worry, it happens to the best of us. Let's get you
        back on track – head back to our
        <NuxtLink to="/">homepage</NuxtLink>
        and explore the wonders awaiting you there.
      </p>
    </v-container>
  </NuxtLayout>
</template>

<style lang="sass" scoped>
.v-container
    height: 100% !important
    #not-found-message
      width: 500px
      padding: 0 20px 20px 20px
      text-align: justify !important
      @media (max-width: $small-screen)
        width: 100%
</style>
