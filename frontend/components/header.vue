<template>
  <div id="header">
    <div id="main">
      <NuxtLink id="title" to="/">
        <h3>Trivia Quest</h3>
      </NuxtLink>
      <div id="links">
        <NuxtLink to="/login">
          <v-btn :variant="handleLoginButtonVariant"> login </v-btn>
        </NuxtLink>
        <NuxtLink to="/register">
          <v-btn :variant="handleRegisterButtonVariant"> register </v-btn>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style lang="sass">
#header
  width: 100%
  height: 10%
  background: transparent
  display: flex
  align-items: center
  justify-content: center
  padding: 10px
  #main
    width: 100%
    height: 100%
    border-radius: 22.5px / 22.5px
    display: flex
    flex-direction: row
    align-items: center
    justify-content: space-between
    padding: 20px
  #title
    text-decoration: none
  #links
    width: 200px
    display: flex
    align-items: center
    justify-content: space-between
</style>

<script>
export default {
  computed: {
    handleLoginButtonVariant() {
      return useRoute().name === "login" ? "tonal" : "plain";
    },
    handleRegisterButtonVariant() {
      return useRoute().name !== "login" ? "tonal" : "plain";
    },
  },
};
</script>
