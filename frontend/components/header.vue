<template>
  <!-- Header container -->
  <div id="header" class="w-100 d-flex align-center justify-center">
    <!-- Main content section -->
    <div
      id="main"
      class="w-100 h-100 d-flex flex-row align-center justify-space-between"
    >
      <!-- Site title linking to home -->
      <NuxtLink id="title" to="/">
        <div class="d-flex flex-row align-center justify-center">
          <div id="title-icon"></div>
          <h3 id="title-text">Trivia Quest</h3>
        </div>
      </NuxtLink>
      <div>
        <!-- User menu (visible when session is valid) -->
        <v-menu v-if="store.sessionValid" min-width="200px" rounded>
          <template v-slot:activator="{ props }">
            <!-- User avatar -->
            <v-btn icon v-bind="props">
              <v-avatar size="large">
                <span class="text-h5">{{ store.username[0] }}</span>
              </v-avatar>
            </v-btn>
          </template>

          <!-- User menu card -->
          <v-card rounded="lg">
            <v-card-text>
              <div class="mx-auto text-center d-flex flex-column">
                <!-- User avatar and name -->
                <div
                  id="menu-card-avatar"
                  class="w-100 d-flex flex-column align-center justify-center"
                >
                  <v-avatar variant="tonal">
                    <span class="text-h5">{{ store.username[0] }}</span>
                  </v-avatar>
                  <span>{{ store.username }}</span>
                </div>
                <!-- Divider -->
                <v-divider class="my-3"></v-divider>
                <!-- go to /account/profile -->
                <v-btn to="/account/profile" rounded="lg" variant="plain">
                  Edit Account
                </v-btn>
                <!-- Logout button -->
                <v-dialog width="500">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      variant="text"
                      color="error"
                      v-bind="props"
                      rounded="lg"
                      >logout</v-btn
                    >
                  </template>

                  <template v-slot:default="{ isActive }">
                    <v-card id="dialog-card" rounded="xl">
                      <v-card-text class="d-flex flex-row">
                        <v-icon class="mdi mdi-exit-run icon-margin" />
                        <h1 class="text-h5">Confirm Logout</h1>
                      </v-card-text>
                      <v-card-text>
                        Are you sure you want to log out? Logging out will end
                        your current session and you will need to sign in again
                        to access your account.
                      </v-card-text>

                      <!-- Buttons for confirming or canceling logout -->
                      <v-card-actions
                        class="d-flex flex-row align-center justify-space-around"
                      >
                        <v-btn
                          text="Close"
                          @click="isActive.value = false"
                          rounded="lg"
                        />
                        <v-btn
                          text="Confirm"
                          color="error"
                          @click="userStore.logoutHandler"
                          rounded="lg"
                        />
                      </v-card-actions>
                    </v-card>
                  </template>
                </v-dialog>
              </div>
            </v-card-text>
          </v-card>
        </v-menu>

        <!-- Login and Register links (visible when session is not valid) -->
        <div
          id="links"
          class="d-flex flex-row align-center justify-space-between"
          v-else
        >
          <v-btn
            color="primary"
            :variant="handleLoginButtonVariant"
            to="/login"
            rounded="lg"
          >
            login
          </v-btn>

          <v-btn
            color="primary"
            :variant="handleRegisterButtonVariant"
            to="/register"
            rounded="lg"
          >
            register
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="sass">
#dialog-card
  padding: 28px 20px
  .icon-margin
    margin-right: 10px
#menu-card-avatar
  > *
    margin: 5px !important
#header
  height: 10%
  background: transparent
  padding: 10px
  #main
    border-radius: 22.5px / 22.5px
    padding: 20px
  #title
    text-decoration: none
    &-text
      display: block
      @media (max-width: $small-screen)
        display: none
    &-icon
      width: 36px !important
      height: 36px !important
      background: url("/favicon.ico") no-repeat center
      background-size: contain
  #links
    width: 200px
</style>

<script>
import { useMainStore } from "~/store/index";
import { useUserStore } from "~/store/user";
export default {
  setup() {
    const store = useMainStore();
    const userStore = useUserStore();
    return { store: store, userStore: userStore };
  },
  computed: {
    // Determine login button variant based on current route
    handleLoginButtonVariant() {
      return useRoute().name === "login" ? "tonal" : "plain";
    },
    // Determine register button variant based on current route
    handleRegisterButtonVariant() {
      return useRoute().name !== "login" ? "tonal" : "plain";
    },
  },
};
</script>
