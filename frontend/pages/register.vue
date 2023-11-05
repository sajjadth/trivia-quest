<template>
  <div id="main">
    <div id="left-side">
      <Carousel />
    </div>
    <div id="right-side">
      <form @submit.prevent>
        <!-- Card component with dynamic properties based on step -->
        <v-card
          :prepend-icon="store.setTitleIcon"
          :title="store.setTitle"
          id="card"
          class="mx-auto"
          max-width="500"
          variant="text"
          :disabled="store.loading"
          :loading="store.loading"
        >
          <!-- Window component to toggle between different steps -->
          <v-window flat v-model="store.step">
            <!-- Step 0  user info-->
            <v-window-item :value="0">
              <!-- Input fields for step 0 -->
              <v-text-field
                class="text-field"
                v-model="store.info.email"
                :rules="[
                  store.rules.email,
                  store.rules.required,
                  store.rules.maxCounter,
                  store.rules.minCounter,
                ]"
                label="Email"
                placeholder="example@domain.com"
                variant="solo"
                type="email"
              ></v-text-field>
              <v-text-field
                class="text-field"
                v-model="store.info.username"
                :rules="[
                  store.rules.required,
                  store.rules.maxCounter,
                  store.rules.minCounter,
                  store.rules.username,
                ]"
                label="Username"
                placeholder="Adam221"
                variant="solo"
                :disabled="store.registered"
                type="text"
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
                placeholder="Enter your password"
                variant="solo"
                :disabled="store.registered"
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
                placeholder="Confirm your password"
                variant="solo"
                :disabled="store.registered"
                @click:append-inner="store.handlePasswordConfirmVisibility"
              ></v-text-field>
              <!-- Card subtitle for step 0 -->
              <v-card-subtitle>
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
            </v-window-item>

            <!-- Step 1  verify email-->
            <v-window-item :value="1">
              <!-- Card title for step 1 -->
              <v-card-title
                class="d-flex w-100 flex-column align-center justify-center"
              >
                <h1 class="text-h4 text-center">Verify Your Email</h1>
                <p
                  class="white-space-normal text-caption w-75 text-center text-grey-lighten-1"
                >
                  We are sending a OTP to validate your Email addres. Hang on!
                </p>
              </v-card-title>
              <!-- OTP input field -->
              <form @submit.prevent>
                <v-card-text>
                  <VOtpInput
                    v-model="store.info.verificationsCode"
                    variant="outlined"
                    length="6"
                    type="number"
                  ></VOtpInput>
                </v-card-text>
              </form>
              <!-- Card subtitle for step 1 -->
              <v-card-subtitle>
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
                <div
                  class="d-flex flex-column align-center justify-center w-100"
                >
                  <p
                    class="white-space-normal text-caption w-75 text-center text-grey-lighten-1"
                  >
                    An OTP has been sent to your email. Please check your spam
                    folder too.
                  </p>

                  <!-- Button to send email again -->
                  <v-btn
                    @click="store.sendEmailAgain"
                    variant="plain"
                    :disabled="store.timer.timer !== 0"
                  >
                    Send Again
                  </v-btn>
                </div>
              </v-card-subtitle>
            </v-window-item>

            <!-- Step 3: Registration Complete -->
            <v-window-item :value="3">
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
            </v-window-item>
          </v-window>

          <!-- Card actions (buttons) -->
          <v-card-actions>
            <!-- Edit button (visible in step 1) -->
            <v-btn
              v-if="store.step === 1"
              variant="text"
              @click="store.previousStep"
            >
              Edit
            </v-btn>
            <!-- Register button (visible in step 0) -->
            <v-btn
              v-if="store.step === 0"
              color="primary"
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
            >
              {{ store.registered ? "Update" : "Register" }}
              <!-- Submit button (visible in step 1) -->
            </v-btn>
            <v-btn
              v-if="store.step === 1"
              color="primary"
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
        </v-card>
      </form>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.text-field
  margin-bottom: 5px
.white-space-normal
  white-space: normal
#main
    width: 100%
    height: 100%
    padding: 0 10px 10px 10px
    display: flex
    flex-direction: row
    @media (max-width: $medium-screen)
        flex-direction: column
    #left-side
        width: 100%
        height: 100%
        border-radius: 20px
        overflow: hidden
        @media (max-width: $medium-screen)
            height: 50%
    #right-side
        width: 50%
        height: 100%
        border-radius: 20px
        display: flex
        flex-direction: column
        align-items: center
        justify-content: flex-start
        @media (max-width: $extra-large-screen)
            width: 75%
        @media (max-width: $large-screen)
            width: 100%
        form
            width: 100%
            height: 100%
            padding: 0 10px 0 20px
            #card
                width: 100%
                height: 100%
                display: flex
                flex-direction: column
                align-items: stretch
                justify-content: space-between
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
  updated() {
    // Start timer when step is 1
    if (this.store.step === 1) this.store.startTimer();
  },
  unmounted() {
    this.store.$reset();
  },
};
</script>
