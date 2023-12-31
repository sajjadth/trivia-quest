<template>
  <div id="main" class="w-100 h-100 d-flex align-center justify-center">
    <div class="h-100 rounded-xl" id="left-side-bg">
      <p class="photo-credit text-caption">
        Photo by
        <a
          class="text-caption"
          target="_blank"
          href="https://unsplash.com/@ianchen0?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
        >
          Ian Chen
        </a>
        on
        <a
          class="text-caption"
          target="_blank"
          href="https://unsplash.com/photos/a-person-standing-in-a-cave-with-a-light-coming-through-wrrgZwI7qOY?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
        >
          Unsplash
        </a>
      </p>
    </div>
    <form
      class="h-100 w-100 d-flex flex-column align-center justify-center"
      @submit.prevent
    >
      <!-- Card component with dynamic properties based on step -->
      <v-card
        id="card"
        class="mx-auto h-100"
        max-width="500"
        rounded="xl"
        variant="text"
        :disabled="store.loading"
        :loading="store.loading"
      >
        <!-- Window component to toggle between different steps -->
        <v-window class="h-100" flat v-model="store.step">
          <!-- Step 0  user info-->
          <v-window-item
            class="window-item h-100 d-grid justify-space-between"
            :value="0"
          >
            <v-card-title
              class="d-flex flex-column align-center justify-center"
            >
              <v-icon class="mdi mdi-account-plus"></v-icon>
              <h1 class="text-center text-h4">Create Account</h1>
            </v-card-title>
            <v-card-text class="d-flex flex-column align-center justify-center">
              <!-- Input fields for step 0 -->
              <v-text-field
                class="text-field w-100"
                v-model="store.info.email"
                :rules="[
                  store.rules.email,
                  store.rules.required,
                  store.rules.maxCounter,
                  store.rules.minCounter,
                ]"
                label="Email"
                placeholder="example@domain.com"
                variant="underlined"
                rounded="lg"
                type="email"
              />
              <v-text-field
                class="text-field w-100"
                v-model="store.info.username"
                :rules="[
                  store.rules.required,
                  store.rules.maxCounter,
                  store.rules.minCounter,
                  store.rules.username,
                ]"
                label="Username"
                placeholder="Adam221"
                variant="underlined"
                rounded="lg"
                :disabled="store.registered"
                type="text"
              />
              <v-text-field
                class="text-field w-100"
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
                placeholder="Enter your password"
                variant="underlined"
                rounded="lg"
                :disabled="store.registered"
                @click:append-inner="store.handlePasswordVisibility"
              />
              <v-text-field
                class="text-field w-100"
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
                placeholder="Confirm your password"
                variant="underlined"
                rounded="lg"
                :disabled="store.registered"
                @click:append-inner="store.handlePasswordConfirmVisibility"
              />
            </v-card-text>
            <!-- Card subtitle for step 0 -->
            <v-card-subtitle
              class="d-flex flex-column align-center justify-center"
            >
              <p class="text-center">
                Have an account?
                <NuxtLink to="/login"> Log in </NuxtLink>
              </p>
              <!-- Legal information links -->
              <p class="white-space-normal text-caption text-center">
                By signing up, you agree to our
                <NuxtLink to="#">Terms</NuxtLink>
                ,
                <NuxtLink to="#">Privacy Policy</NuxtLink>
                , and
                <NuxtLink to="#">Cookies Policy</NuxtLink>
                .
              </p>
            </v-card-subtitle>
            <!-- Card actions (buttons) -->
            <v-card-actions class="align-end">
              <!-- Register button (visible in step 0) -->
              <v-btn
                color="info"
                variant="elevated"
                class="flex-grow-1"
                @click="
                  () => {
                    store.registered
                      ? store.updateEmailOnRegister()
                      : store.handleRegisterUser();
                  }
                "
                type="submit"
                :loading="store.loading"
                rounded="lg"
                :disabled="
                  !store.info.username &&
                  !store.info.email &&
                  store.info.password &&
                  store.info.passwordConfirm
                "
              >
                {{ store.registered ? "Update" : "Register" }}
              </v-btn>
            </v-card-actions>
          </v-window-item>

          <!-- Step 1  verify email-->
          <v-window-item
            class="window-item h-100 d-grid justify-space-between"
            :value="1"
          >
            <!-- Card title for step 1 -->
            <v-card-title
              class="d-flex w-100 flex-column align-center justify-space-evenly"
            >
              <v-icon size="x-large" class="mdi mdi-email-fast"></v-icon>
              <h1 class="text-h4 text-center">Verify Your Email</h1>
              <p
                class="white-space-normal text-caption w-75 text-center text-grey-lighten-1"
              >
                We are sending a OTP to validate your Email addres. Hang on!
              </p>
            </v-card-title>
            <!-- Card subtitle for step 1 -->
            <v-card-subtitle class="d-flex flex-column justify-center">
              <!-- OTP input field -->
              <form @submit.prevent>
                <v-card-text>
                  <VOtpInput
                    v-model="store.info.verificationsCode"
                    variant="underlined"
                    length="6"
                    type="number"
                  ></VOtpInput>
                </v-card-text>
              </form>
              <div
                id="timer"
                class="d-flex flex-row align-center justify-center"
              >
                <p id="time" class="text-h6">
                  {{ store.getParsedTimer }}
                </p>
              </div>
              <v-progress-linear
                class="w-75"
                style="margin: 0 0 10px 0"
                :model-value="store.getPercentageOfTimer"
              ></v-progress-linear>
              <div
                class="d-flex flex-column align-center justify-center w-100"
              ></div>
              <div class="d-flex flex-column align-center justify-center w-100">
                <p
                  class="white-space-normal text-caption w-75 text-center text-grey-lighten-1"
                >
                  An OTP has been sent to your email. Please check your spam
                  folder too.
                </p>

                <!-- Button to send email again -->
                <v-btn
                  rounded="lg"
                  @click="store.sendEmailAgain"
                  variant="plain"
                  :disabled="store.timer.timer !== 0"
                >
                  Send Again
                </v-btn>
              </div>
            </v-card-subtitle>
            <v-card-actions class="align-end">
              <!-- Edit button (visible in step 1) -->
              <v-btn rounded="lg" variant="text" @click="store.previousStep">
                Edit
              </v-btn>
              <!-- Submit button (visible in step 1) -->
              <v-btn
                rounded="lg"
                color="info"
                variant="elevated"
                class="flex-grow-1"
                @click="store.verifyUser"
                type="submit"
                :disabled="store.info.verificationsCode.length !== 6"
                :loading="store.loading"
              >
                Submit
              </v-btn>
            </v-card-actions>
          </v-window-item>

          <!-- Step 3: Registration Complete -->
          <v-window-item class="h-100" :value="2">
            <v-row class="h-100 align-center justify-center">
              <div id="done-image"></div>
              <div class="pa-4 text-center">
                <h3 class="text-h6 font-weight-light mb-2">
                  Welcome to Trivia Quest
                </h3>
                <p class="text-caption text-grey">Thanks for signing up!</p>
                <p class="text-caption text-grey">
                  Now you will be redirected to the game lobby.
                </p>
              </div>
            </v-row>
          </v-window-item>
        </v-window>
      </v-card>
    </form>
  </div>
</template>

<style lang="sass" scoped>
#main
  padding: 0 30px 30px 30px
  @media (max-width: $medium-screen)
    padding: 0 10px 10px 10px
  .photo-credit
    position: absolute
    bottom: 10px
    left: 10px
    margin: auto
    padding: 5px 10px
  #left-side-bg
    width: 100%
    position: relative
    border: 1px #333333 solid
    background: url("../assets/images/ian-chen.jpg") center no-repeat
    background-size: cover
    margin-right: 30px
    @media (max-width:$medium-screen)
      display: none
  form
    max-width: 500px !important
  #card
    padding: 20px !important
    border: 1px #333333 solid
    width: 100%
    @media (max-width: $medium-screen)
      padding: 8px 0 !important
      .v-card-actions
        padding: 8px 16px
    .window-item
      display: grid
    p
      margin: 10px
      span
        margin: 2px
  #done-image
    background: url("../assets/images/sammy-done.png") center no-repeat
    background-size: contain
    width: 100%
    height: 50vh
</style>

<script>
import { VOtpInput } from "vuetify/labs/VOtpInput";
import { useUserStore } from "../store/user.js";
export default {
  // Get the user store using Pinia and return it as 'store'
  setup() {
    const store = useUserStore();
    return { store: store };
  },
  components: {
    VOtpInput,
  },
  unmounted() {
    this.store.$reset();
  },
};
</script>
