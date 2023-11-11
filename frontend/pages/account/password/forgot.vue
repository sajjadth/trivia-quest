<template>
  <!-- Main container with centered content -->
  <v-container class="h-100 d-flex flex-column align-center justify-center">
    <!-- Card with maximum width of 500 and centered -->
    <v-card
      :loading="store.loading"
      :disabled="store.loading"
      class="mx-auto"
      rounded="xl"
    >
      <!-- Window component for handling steps -->
      <v-window id="forgot-password-main-window" v-model="store.step">
        <!-- Step 0: Request email for password reset -->
        <v-window-item class="w-100 h-100" :value="0">
          <!-- Card title with lock icon -->
          <v-card-title
            class="text-h6 text-center font-weight-regular justify-space-between"
          >
            <v-avatar size="100" variant="outlined">
              <v-icon size="50" icon="mdi-lock" />
            </v-avatar>
          </v-card-title>

          <!-- Card text with trouble logging in message -->
          <v-card-text
            id="forgot-password-text"
            class="text-center d-flex flex-column align-center justify-space-between"
          >
            <h1 class="text-h5">Trouble logging in?</h1>
            <p class="text-body-1 text-grey-darken-1">
              Enter your email and we'll send you a link to get back into your
              account.
            </p>
          </v-card-text>

          <!-- Email input field -->
          <v-card-text>
            <v-text-field
              label="Email"
              placeholder="john@google.com"
              variant="underlined"
              v-model="store.info.email"
            ></v-text-field>

            <!-- Button to send reset link -->
            <v-btn
              block
              :disabled="!store.info.email"
              :loading="store.loading"
              color="info"
              variant="elevated"
              rounded="lg"
              @click="store.sendResetPasswordLink"
            >
              Send link
            </v-btn>
          </v-card-text>

          <!-- Divider and OR message -->
          <v-card-text class="d-flex flex-row align-center justify-center">
            <v-divider class="divider-p-4" />
            <p>OR</p>
            <v-divider class="divider-p-4" />
          </v-card-text>

          <!-- Actions: Create new account and Back to login -->
          <v-card-actions
            id="password-forgot-action"
            class="d-flex flex-column align-center justify-space-between w-100"
          >
            <v-btn color="info" variant="plain" rounded="lg" to="/register">
              Create new account
            </v-btn>
            <v-btn color="info" variant="plain" rounded="lg" to="/login">
              Back to login
            </v-btn>
          </v-card-actions>
        </v-window-item>

        <!-- Step 1: Password Reset Email Sent confirmation -->
        <v-window-item class="w-100 h-100" :value="1">
          <v-card-item
            class="d-flex flex-column align-center justify-space-between"
          >
            <div id="done-image"></div>
            <div
              class="pa-4 text-center d-flex flex-column align-center justify-center"
            >
              <h3 class="text-h6 font-weight-light mb-2">
                Password Reset Email Sent
              </h3>
              <p class="text-caption text-grey">
                Check your inbox for a password reset email. Follow the
                instructions to regain access to your account.
              </p>
            </div>
          </v-card-item>
        </v-window-item>
      </v-window>
    </v-card>
  </v-container>
</template>

<script>
import { useUserStore } from "~/store/user.js";
import { useMainStore } from "~/store/index.js";

export default {
  // Get the user store using Pinia and return it as 'store'
  setup() {
    const store = useUserStore();
    const mainStore = useMainStore();

    return { store: store, mainStore: mainStore };
  },
  unmounted() {
    this.store.$reset();
  },
};
</script>

<style scoped lang="sass">
.divider-p-4
    margin-inline: 20px
    @media(max-width: $small-screen)
      // padding: 10px
.v-container
  @media (max-width: $medium-screen)
      padding: 0 10px 10px 10px !important
.v-card
    padding: 28px 20px
    border: 1px #333333 solid
    width: 500px
    height: fit-content
    @media (max-width: $small-screen)
      width: 100%
    #password-forgot-action
        >*
          padding: 10px
    #forgot-password-text
        >*
          padding: 20px 20px 0 20px
          @media (max-width: $small-screen)
            padding: 10px 10px 0 10px
#done-image
    background: url("~/assets/images/sammy-email-send.png") center no-repeat
    background-size: contain
    width: 100%
    height: 50vh
</style>
