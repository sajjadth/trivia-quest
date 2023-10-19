import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    info: {
      email: "",
      username: "",
      password: "",
      passwordConfirm: "",
      passwordVisible: false,
      passwordConfirmVisible: false,
      verificationsCode: "",
    },
    timer: {
      timer: 300,
      timerInterval: null,
    },
    step: 0,
    rules: {
      required: (value) => !!value || "Required.",
      maxCounter: (value) => value.length <= 20 || "Maximum 20 characters",
      minCounter: (value) => value.length >= 8 || "Minimum 8 characters",
      email: (value) => {
        const pattern =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "Invalid e-mail.";
      },
      password: (value) => {
        const lowercaseRegex = /[a-z]/;
        const uppercaseRegex = /[A-Z]/;
        const digitRegex = /\d/;
        const specialCharRegex = /[@$!%*?&]/;
        return lowercaseRegex.test(value)
          ? uppercaseRegex.test(value)
            ? digitRegex.test(value)
              ? specialCharRegex.test(value)
                ? true
                : "Password must contain at least one special character."
              : "Password must contain at least one digit."
            : "Password must contain at least one uppercase letter."
          : "Password must contain at least one lowercase letter.";
      },
      username: (value) => {
        const pattern = /^[a-zA-Z0-9-_]+$/;
        return (
          pattern.test(value) ||
          "Username must contain only letters (both uppercase and lowercase), numbers, underscores, and hyphens."
        );
      },
    },
    snackbar: {
      stat: false,
      message: "",
      color: "",
    },
    loading: false,
  }),
  actions: {
    // register user
    handleRegisterUser() {
      // Destructure properties from this.info and this.rules for easier access
      const { passwordConfirm } = this.info;
      const { email, minCounter, maxCounter, password, username } = this.rules;

      // Array of validation checks for registration form
      const isValid = [
        email(this.info.email),
        minCounter(this.info.username),
        maxCounter(this.info.username),
        minCounter(this.info.password),
        maxCounter(this.info.password),
        minCounter(passwordConfirm),
        maxCounter(passwordConfirm),
        password(this.info.password),
        username(this.info.username),
        this.info.password === passwordConfirm,
      ].every((result) => result === true);

      // If all checks pass, register user
      if (isValid) {
        const apiUrl = useRuntimeConfig().public.API_BASE_URL;
        // User registration
        this.loading = true;
        fetch(`${apiUrl}/auth/register`, {
          method: "POST",
          body: JSON.stringify({
            username: this.info.username,
            password: this.info.password,
            email: this.info.email,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (!data.success) {
              this.openSnackbar(data.error, "error");
            } else {
              this.openSnackbar(data.message, "success");
              this.step++;
            }
          })
          .catch((err) => console.log("err", err))
          .finally(() => {
            this.loading = false;
          });
      } else {
        this.openSnackbar(
          "Oops! It seems you missed a few fields. Please complete all required inputs.",
          "error"
        );
      }
    },
    // verify user with verification code sended to user email
    verifyUser() {
      const apiUrl = useRuntimeConfig().public.API_BASE_URL;
      this.loading = true;
      fetch(`${apiUrl}/auth/email/verify`, {
        method: "POST",
        body: JSON.stringify({
          verification_code: this.info.verificationsCode,
          email: this.info.email,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.success) {
            this.openSnackbar(data.error, "error");
          } else {
            this.step++;
            setTimeout(() => {
              navigateTo("/login");
            }, 5000);
          }
        })
        .catch((err) => console.log("error:", err))
        .finally(() => (this.loading = false));
    },
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
      this.timer.timerInterval = null;
    },
    // Send new verrification code to email
    sendEmailAgain() {
      const apiUrl = useRuntimeConfig().public.API_BASE_URL;
      this.loading = true;
      fetch(`${apiUrl}/auth/email/send`, {
        method: "POST",
        body: JSON.stringify({ email: this.info.email }),
      })
        .then((res) => res.json())
        .then((data) => {
          this.openSnackbar("New code sent. Check your inbox!", "success");
          this.startTimer();
        })
        .catch((err) => console.log("error:", err))
        .finally(() => (this.loading = false));
    },
    openSnackbar(message, color) {
      this.snackbar.color = color;
      this.snackbar.message = message;
      this.snackbar.stat = true;
    },
    closeSnackbar() {
      this.snackbar.stat = false;
      this.snackbar.color = "";
      this.snackbar.message = "";
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
      return state.step === 0
        ? "Create Account"
        : state.step === 1
        ? "Confirm Email"
        : "Done";
    },
    // Dynamic icon for the card based on the current step
    setTitleIcon: (state) => {
      return state.step === 0
        ? "mdi-account-plus"
        : state.step === 1
        ? "mdi-email-fast"
        : "mdi-check";
    },
    getPercentageOfTimer: (state) => {
      return state.timer.timer / 3;
    },
  },
});
