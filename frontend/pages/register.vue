<template>
  <div id="main">
    <div id="left-side"></div>
    <div id="right-side">
      <form action="">
        <v-card
          :prepend-icon="setTitleIcon"
          :title="setTitle"
          id="card"
          class="mx-auto"
          max-width="500"
          variant="text"
        >
          <h1 v-if="step === 0" class="text-h5 text-center">
            Join the Quest for Knowledge!
          </h1>
          <v-window v-model="step">
            <v-window-item :value="0">
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
            </v-window-item>

            <div
              v-if="step === 1"
              class="d-flex flex-column align-center justify-center"
            >
              <h1 class="text-h4 text-center">Verify Your Email</h1>
              <p class="text-caption w-75 text-center text-grey-darken-1">
                We are sending a OTP to validate your Email addres. Hang on!
              </p>
            </div>
            <v-window-item :value="1">
              <v-card-text>
                <VOtpInput variant="outlined"></VOtpInput>
              </v-card-text>
            </v-window-item>
            <div
              v-if="step === 1"
              class="d-flex flex-column align-center justify-center"
            >
              <p class="text-caption w-75 text-center text-grey-darken-1">
                An OTP has been sent to your email. Please check your spam
                folder too.
              </p>
            </div>
          </v-window>

          <p v-if="step === 0" class="text-caption text-center">
            By signing up, you agree to our
            <NuxtLink to="#">Terms</NuxtLink>
            ,
            <NuxtLink to="#">Privacy Policy</NuxtLink>
            , and
            <NuxtLink to="#">Cookies Policy</NuxtLink>
            .
          </p>

          <v-card-actions>
            <v-btn v-if="step === 1" variant="text" @click="step--">
              Back
            </v-btn>
            <!-- <v-spacer></v-spacer> -->
            <v-btn
              v-if="step === 0"
              color="primary"
              variant="elevated"
              @click="step++"
              class="flex-grow-1"
            >
              Register
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
          <p class="text-center" v-if="step === 0">
            Have an account?
            <NuxtLink to="/login"> Log in </NuxtLink>
          </p>
        </v-card>
      </form>
    </div>
  </div>
</template>

<style lang="sass" scoped>
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
    };
  },
  computed: {
    setTitle() {
      return this.step === 0 ? "Create Account" : "Confirm Email";
    },
    setTitleIcon() {
      return this.step === 0 ? "mdi-account-plus" : "mdi-email-fast";
    },
  },
  components: {
    VOtpInput,
  },
};
</script>
