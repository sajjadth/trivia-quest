<template>
  <div id="header">
    <div id="main">
      <NuxtLink id="title" to="/">
        <h3>Trivia Quest</h3>
      </NuxtLink>
      <div>
        <v-menu v-if="store.sessionValid" min-width="200px" rounded>
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props">
              <v-avatar size="large">
                <span class="text-h5">{{ store.username[0] }}</span>
              </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              <div class="mx-auto text-center d-flex flex-column">
                <div
                  id="menu-card-avatar"
                  class="w-100 d-flex flex-column align-center justify-center"
                >
                  <v-avatar variant="tonal">
                    <span class="text-h5">{{ store.username[0] }}</span>
                  </v-avatar>
                  <span>{{ store.username }}</span>
                </div>
                <v-divider class="my-3"></v-divider>
                <v-btn variant="plain" disabled> Edit Account </v-btn>
                <v-btn variant="plain"> LogoUt </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-menu>
        <div id="links" v-else>
          <NuxtLink to="/login">
            <v-btn :variant="handleLoginButtonVariant"> login </v-btn>
          </NuxtLink>
          <NuxtLink to="/register">
            <v-btn :variant="handleRegisterButtonVariant"> register </v-btn>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="sass">
#menu-card-avatar
  > *
    margin: 5px !important
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
import { useMainStore } from "../store/index";
export default {
  setup() {
    const store = useMainStore();
    return { store: store };
  },
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
