<template>
  <div id="main">
    <div id="left-side"></div>
    <div id="right-side">
      <form action="">
        <!-- Card component with dynamic properties based on step -->
        <v-card
          :prepend-icon="setTitleIcon"
          :title="setTitle"
          id="card"
          class="mx-auto"
          max-width="500"
          variant="text"
        >
          <!-- Window component to toggle between different steps -->
          <v-window flat v-model="step">
            <!-- Step 0  user info-->
            <v-window-item :value="0">
              <!-- Card title for step 0 -->
              <v-card-title>
                <h1 class="text-h5 text-center">
                  Join the Quest for Knowledge!
                </h1>
              </v-card-title>
              <!-- Input fields for step 0 -->
              <v-text-field
                label="Email"
                placeholder="example@domain.com"
                variant="solo"
                :type="email"
              ></v-text-field>
              <v-text-field
                label="Username"
                placeholder="Adam221"
                variant="solo"
                :type="text"
              ></v-text-field>
              <v-text-field
                label="Password"
                :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="passwordVisible ? 'text' : 'password'"
                density="compact"
                placeholder="Enter your password"
                variant="solo"
                @click:append-inner="passwordVisible = !passwordVisible"
              ></v-text-field>
              <v-text-field
                label="Confirm Password"
                :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="passwordVisible ? 'text' : 'password'"
                density="compact"
                placeholder="Confirm your password"
                variant="solo"
                @click:append-inner="passwordVisible = !passwordVisible"
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
              <v-card-text>
                <VOtpInput variant="outlined"></VOtpInput>
              </v-card-text>
              <!-- Card subtitle for step 1 -->
              <v-card-subtitle>
                <div
                  id="timer"
                  class="d-flex flex-row align-center justify-center"
                >
                  <p id="time" class="text-h6">
                    {{ getParsedTimer }}
                  </p>
                </div>
                <v-progress-linear
                  class="w-75"
                  style="margin: 0 0 10px 0"
                  :model-value="timer / 3"
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
                  <v-btn
                    @click="sendEmailAgain"
                    variant="plain"
                    :disabled="timer !== 0"
                  >
                    Send Again
                  </v-btn>
                </div>
              </v-card-subtitle>
            </v-window-item>
          </v-window>

          <!-- Card actions (buttons) -->
          <v-card-actions>
            <!-- Back button (visible in step 1) -->
            <v-btn v-if="step === 1" variant="text" @click="step--">
              Edit
            </v-btn>
            <!-- Register button (visible in step 0) -->
            <v-btn
              v-if="step === 0"
              color="primary"
              variant="elevated"
              @click="step++"
              class="flex-grow-1"
            >
              Register
              <!-- Submit button (visible in step 1) -->
            </v-btn>
            <v-btn
              v-if="step === 1"
              color="primary"
              variant="elevated"
              @click="step++"
              class="flex-grow-1"
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
        background: url("../assets/images/holly-mandarich.jpg") center no-repeat
        background-size: cover
        width: 100%
        height: 100%
        border-radius: 20px
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
</style>

<script>
import { VOtpInput } from "vuetify/labs/VOtpInput";
export default {
  data() {
    return {
      step: 0,
      passwordVisible: false,
      timer: 300,
      timerInterval: null,
    };
  },
  methods: {
    // Starting timer and stops when timer ends
    startTimer() {
      if (this.timer === 0) this.timer = 300;
      this.timerInterval = setInterval(
        function () {
          if (this.timer != 0) this.timer--;
          else this.stopTimer();
        }.bind(this),
        1000
      );
    },
    // Stopping timer
    stopTimer() {
      clearInterval(this.timerInterval);
    },
    // Send new verrification code to email
    sendEmailAgain() {
      this.startTimer();
    },
  },
  computed: {
    // Dynamic title for the card based on the current step
    setTitle() {
      return this.step === 0 ? "Create Account" : "Confirm Email";
    },
    // Dynamic icon for the card based on the current step
    setTitleIcon() {
      return this.step === 0 ? "mdi-account-plus" : "mdi-email-fast";
    },
    // Parsing time to display it properly in the DOM
    getParsedTimer() {
      const minute =
        this.timer / 60 < 10
          ? "0" + Math.floor(this.timer / 60)
          : Math.floor(this.timer / 60);
      const seconds =
        this.timer % 60 < 10 ? "0" + (this.timer % 60) : this.timer % 60;

      return minute + " : " + seconds;
    },
  },
  components: {
    VOtpInput,
  },
  updated() {
    // Start timer when step is 1
    if (this.step === 1) this.startTimer();
  },
};
</script>
