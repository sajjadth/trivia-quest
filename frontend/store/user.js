import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    info: {
      email: "",
      username: "sajjad",
      password: "",
      passwordConfirm: "",
      passwordVisible: false,
      passwordConfirmVisible: false,
    },
    timer: {
      timer: 300,
      timerInterval: null,
    },
    step: 0,
    rules: {
      required: (value) => !!value || "Required.",
      counter: (value) => value.length <= 20 || "Max 20 characters",
      email: (value) => {
        const pattern =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "Invalid e-mail.";
      },
    },
  }),
  actions: {
    // Change visibility of password
    handlePasswordVisibility() {
      this.info.passwordVisible = !this.info.passwordVisible;
    },
    // Change visibility of password confirm
    handlePasswordConfirmVisibility() {
      this.info.passwordConfirmVisible = !this.info.passwordConfirmVisible;
    },
    // Change step to next one
    nextStep() {
      this.step++;
    },
    // Change step to previous one
    previousStep() {
      this.step--;
    },
    // Starting timer and stops when timer ends
    startTimer() {
      if (this.timer.timer === 0) this.timer.timer = 300;
      if (!this.timer.timerInterval) {
        this.timer.timerInterval = setInterval(
          function () {
            if (this.timer.timer != 0) this.timer.timer--;
            else this.stopTimer();
          }.bind(this),
          1000
        );
      }
    },
    // Stopping timer
    stopTimer() {
      clearInterval(this.timer.timerInterval);
    },
    // Send new verrification code to email
    sendEmailAgain() {
      this.startTimer();
    },
  },
  getters: {
    // Parsing time to display it properly in the DOM
    getParsedTimer: (state) => {
      const minute =
        state.timer.timer / 60 < 10
          ? "0" + Math.floor(state.timer.timer / 60)
          : Math.floor(state.timer.timer / 60);
      const seconds =
        state.timer.timer % 60 < 10
          ? "0" + (state.timer.timer % 60)
          : state.timer.timer % 60;

      return minute + " : " + seconds;
    },
    // Dynamic title for the card based on the current step
    setTitle: (state) => {
      return state.step === 0 ? "Create Account" : "Confirm Email";
    },
    // Dynamic icon for the card based on the current step
    setTitleIcon: (state) => {
      return state.step === 0 ? "mdi-account-plus" : "mdi-email-fast";
    },
  },
});
