<template>
  <!-- Main container with centered content -->
  <v-container class="h-100 d-flex flex-column align-center justify-center">
    <!-- Card -->
    <v-card :loading="store.loading" :disabled="store.loading" class="mx-auto">
      <!-- Window component for handling steps -->
      <v-window id="reset-password-main-window" v-model="store.step">
        <!-- Step 0: password update -->
        <v-window-item class="w-100 h-100" :value="0">
          <!-- Card title with lock icon -->
          <v-card-title
            class="text-h6 text-center font-weight-regular justify-space-between"
          >
            <v-avatar size="100" variant="outlined">
              <v-icon size="75" icon="mdi-lock-reset" />
            </v-avatar>
          </v-card-title>

          <!-- Card text with Update Your Password in message -->
          <v-card-text
            id="reset-password-text"
            class="text-center d-flex flex-column align-center justify-space-between"
          >
            <h1 class="text-h5">Update Your Password</h1>
            <p class="text-body-1 text-grey-darken-1">
              Enter a new password and confirm it below to regain access to your
              account
            </p>
          </v-card-text>

          <!-- password input field -->
          <v-card-text>
            <v-text-field
              class="text-field"
              :rules="[
                store.rules.required,
                store.rules.maxCounter,
                store.rules.minCounter,
              ]"
              v-model="store.info.oldPassword"
              label="Old Password"
              :append-inner-icon="
                store.info.oldPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'
              "
              :type="store.info.oldPasswordVisible ? 'text' : 'password'"
              density="compact"
              placeholder="Enter your old password"
              variant="outlined"
              @click:append-inner="store.handleOldPasswordVisibility"
            ></v-text-field>
            <v-text-field
              class="text-field"
              :rules="[
                store.rules.required,
                store.rules.maxCounter,
                store.rules.minCounter,
                store.rules.password,
              ]"
              v-model="store.info.password"
              label="Password"
              :append-inner-icon="
                store.info.passwordVisible ? 'mdi-eye-off' : 'mdi-eye'
              "
              :type="store.info.passwordVisible ? 'text' : 'password'"
              density="compact"
              placeholder="Enter your new password"
              variant="outlined"
              @click:append-inner="store.handlePasswordVisibility"
            ></v-text-field>
            <v-text-field
              class="text-field"
              :rules="[
                store.rules.required,
                store.rules.maxCounter,
                store.rules.minCounter,
                (value) => {
                  return (
                    store.info.password === value || `Passwords don't match.`
                  );
                },
              ]"
              v-model="store.info.passwordConfirm"
              label="Confirm Password"
              :append-inner-icon="
                store.info.passwordConfirmVisible ? 'mdi-eye-off' : 'mdi-eye'
              "
              :type="store.info.passwordConfirmVisible ? 'text' : 'password'"
              density="compact"
              placeholder="Confirm your new password"
              variant="outlined"
              @click:append-inner="store.handlePasswordConfirmVisibility"
            ></v-text-field>

            <!-- Button to update password -->
            <v-btn
              block
              :disabled="!store.info.password && store.info.passwordConfirm"
              :loading="store.loading"
              color="info"
              variant="elevated"
              @click="store.handlePasswordUpdate"
            >
              Update Password
            </v-btn>
          </v-card-text>
        </v-window-item>

        <!-- Step 1: show congratulations when password reseted successfully -->
        <v-window-item :value="1">
          <div id="done-image"></div>
          <div
            class="pa-4 text-center d-flex flex-column align-center justify-center"
          >
            <h3 class="text-h6 font-weight-light mb-2">
              Password Reset Successful
            </h3>
            <p class="text-caption text-grey">
              Congratulations! Your password has been successfully updated.
              <br />
              You can now use your new password for accessing this account
              <br />
              Now you will be redirected to the game lobby.
            </p>
          </div>
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
.text-field
    margin-bottom: 10px
.divider-p-4
    margin-inline: 20px
#reset-password-main-window
    width: 500px
    padding: 25px
    height: fit-content
    @media (max-width: $small-screen)
      padding: 5px
      width: 100%
    #password-reset-action
        >*
          padding: 10px
    #reset-password-text
        >*
          padding: 20px 20px 0 20px
          @media (max-width: $small-screen)
            padding: 10px 10px 0 10px
#done-image
    background: url("~/assets/images/sammy-reset-password.png") center no-repeat
    background-size: contain
    width: 100%
    height: 50vh
</style>
