import { defineStore } from "pinia";
import { useMainStore } from ".";

export const useUserStore = defineStore("user", {
  state: () => ({
    info: {
      email: "",
      username: "",
      password: "",
      passwordConfirm: "",
      oldPassword: "",
      passwordVisible: false,
      passwordConfirmVisible: false,
      oldPasswordVisible: false,
      verificationsCode: "",
      rememberMe: false,
      previousEmail: "",
      score: 0,
      place: 0,
    },
    registered: false,
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
    tmpkey: useRoute().query.tmpkey,
    loading: false,
  }),
  actions: {
    // login user
    handleLoginUser() {
      // Access the main store
      const mainStore = useMainStore();

      this.loading = true;
      const apiUrl = useRuntimeConfig().public.API_BASE_URL;

      fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        body: JSON.stringify({
          email: this.info.email,
          password: this.info.password,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.success) {
            mainStore.openSnackbar(data.error, "error");
          } else {
            mainStore.openSnackbar(
              data.message,
              data.need_confirmation ? "warning" : "success"
            );
            if (data.need_confirmation) {
              this.step++;
              this.startTimer();
            } else {
              this.step = 2;
              setTimeout(() => {
                reloadNuxtApp({ path: "/app" });
              }, 5000);
            }
          }
        })
        .catch((err) => console.log("error", err))
        .finally(() => (this.loading = false));
    },
    // register user
    handleRegisterUser() {
      const mainStore = useMainStore();
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
        // create verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000);

        // User registration
        this.loading = true;

        // store info in localStorage
        localStorage.setItem("username", this.info.username);
        localStorage.setItem("email", this.info.email);
        localStorage.setItem("password", this.info.password);
        localStorage.setItem("verificationCode", verificationCode);
        localStorage.setItem("verified", false);

        fetch(
          `https://trivia-quest.sajjadth.workers.dev/?email=${this.info.email}&type=verify&code=${verificationCode}`,
          {
            method: "GET",
          }
        )
          .then((res) => res.json())
          .then((data) => {
            if (!data.success) {
              mainStore.openSnackbar(data.error, "error");
            } else {
              this.registered = true;
              mainStore.openSnackbar(data.message, "success");
              this.step++;
              this.startTimer();
            }
          })
          .catch((err) => console.log("err", err))
          .finally(() => {
            this.loading = false;
          });
      } else {
        mainStore.openSnackbar(
          "Oops! It seems you missed a few fields. Please complete all required inputs.",
          "error"
        );
      }
    },
    // verify user with verification code sended to user email
    verifyUser() {
      // Access the main store
      const mainStore = useMainStore();

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
            mainStore.openSnackbar(data.error, "error");
          } else {
            this.step++;
            if (this.info.rememberMe) localStorage.setItem("token", data.token);
            else sessionStorage.setItem("token", data.token);
            setTimeout(() => {
              reloadNuxtApp({ path: "/app" });
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
    // Change visibility of old password
    handleOldPasswordVisibility() {
      this.info.oldPasswordVisible = !this.info.oldPasswordVisible;
    },
    // Change step to next one
    nextStep() {
      this.step++;
    },
    // Change step to previous one
    previousStep() {
      // save email to compare with new email
      this.info.previousEmail = this.info.email;
      // change the state of step
      this.step--;
      // stop timer
      this.timer.timer = 300;
      this.stopTimer();
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
      // Access the main storev
      const mainStore = useMainStore();

      const apiUrl = useRuntimeConfig().public.API_BASE_URL;
      this.loading = true;
      fetch(`${apiUrl}/auth/email/send`, {
        method: "POST",
        body: JSON.stringify({ email: this.info.email }),
      })
        .then((res) => res.json())
        .then((data) => {
          mainStore.openSnackbar("New code sent. Check your inbox!", "success");
          this.startTimer();
        })
        .catch((err) => console.log("error:", err))
        .finally(() => (this.loading = false));
    },
    // 'sendResetPasswordLink' function to send a reset password link
    sendResetPasswordLink() {
      // access the main store
      const mainStore = useMainStore();

      // Check if the entered email follows the specified rules
      if (this.rules.email(this.info.email) !== true)
        mainStore.openSnackbar("Please enter valid email!", "error");
      else {
        // get api url from .env
        const apiUrl = useRuntimeConfig().public.API_BASE_URL;

        // Change the loading state to true
        this.loading = true;

        // Send a request to the server to reset the password
        fetch(`${apiUrl}/auth/password/reset`, {
          method: "POST",
          body: JSON.stringify({
            tmp_key: this.tmpkey,
            email: this.info.email,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            // If the request is not successful, display an error message
            if (!data.success) mainStore.openSnackbar(data.error, "error");
            else {
              // If successful, display a success message and increment the step
              mainStore.openSnackbar(data.message, "success");
              this.step++;
            }
          })
          .catch((err) => console.log("error:", err))
          .finally(() => (this.loading = false));
      }
    },

    // 'resetPasswordHandler' changes the user's password
    resetPasswordHandler() {
      // access the main store
      const mainStore = useMainStore();

      // Check if the entered password follows the specified rules
      if (this.rules.password(this.info.password) !== true)
        mainStore.openSnackbar(
          this.rules.password(this.info.password),
          "error"
        );
      // Check if the entered password and password confirm are match
      else if (this.info.password != this.info.passwordConfirm)
        mainStore.openSnackbar(
          "Passwords do not match. Please try again.",
          "error"
        );
      else {
        // get api url from .env
        const apiUrl = useRuntimeConfig().public.API_BASE_URL;

        // Change the loading state to true
        this.loading = true;

        // Send a request to the server to change the password
        fetch(`${apiUrl}/auth/password/change`, {
          method: "POST",
          body: JSON.stringify({
            tmp_key: this.tmpkey,
            new_password: this.info.password,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            // If the request is not successful, display an error message
            if (!data.success) mainStore.openSnackbar(data.error, "error");
            else {
              // If successful, display a success message
              // and increment the step
              // and redirect user to login in 5 seconds
              mainStore.openSnackbar(data.message, "success");
              this.step++;
              setTimeout(() => {
                navigateTo("/login");
              }, 5000);
            }
          })
          .catch((err) => console.log("error:", err))
          .finally(() => (this.loading = false));
      }
    },
    updateEmailOnRegister() {
      // access the main store
      const mainStore = useMainStore();

      // check if email is not valid show an error
      if (this.rules.email(this.info.email) != true)
        mainStore.openSnackbar(this.rules.email(this.info.email), "error");
      else if (this.info.email === this.info.previousEmail)
        mainStore.openSnackbar(
          "New email is the same as the current one.",
          "error"
        );
      else {
        // get api url from .env
        const apiUrl = useRuntimeConfig().public.API_BASE_URL;

        // change the loading state to true
        this.loading = true;

        // send a request for updating email
        fetch(`${apiUrl}/auth/email/update`, {
          method: "POST",
          body: JSON.stringify({
            email: this.info.email,
            password: this.info.password,
            username: this.info.username,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            // If the request is not successful, display an error message
            if (!data.success) mainStore.openSnackbar(data.error, "error");
            else {
              // If successful, display a success message and increment the step
              mainStore.openSnackbar(data.message, "success");
              this.step++;
              this.timer.timer = 300;
            }
          })
          .catch((err) => console.log("error:", err))
          .finally(() => (this.loading = false));
      }
    },
    // 'logoutHandler' clears the token and redirect user to index page
    logoutHandler() {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      reloadNuxtApp({ path: "/" });
    },
    // 'getUserProfile' gets user info from database
    getUserProfile() {
      // Access the main store
      const mainStore = useMainStore();

      // get api url from .env
      const apiUrl = useRuntimeConfig().public.API_BASE_URL;

      // Change the loading state to true
      this.loading = true;

      // get usre info from database
      fetch(`${apiUrl}/auth/profile`, {
        method: "GET",
        headers: {
          token: mainStore.token,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            this.info.username = data.result.username;
            this.info.email = data.result.email;
            this.info.place = data.result.place;
            this.info.score = data.result.score;
          }
        })
        .catch((err) => console.log("error:", err))
        .finally((this.loading = false));
    },
    handlePasswordUpdate() {
      // Access the main store
      const mainStore = useMainStore();

      // check if new password follows the password rules
      if (this.rules.password(this.info.password) !== true)
        mainStore.openSnackbar(
          this.rules.password(this.info.password),
          "error"
        );
      // check if new password and password confirm are match
      else if (this.info.password != this.info.passwordConfirm)
        mainStore.openSnackbar("Passwords don't match.", "error");
      else if (this.info.password === this.info.oldPassword)
        mainStore.openSnackbar(
          "New password must be different from the old one.",
          "error"
        );
      else {
        // get API_BASE_URL from environment variables
        const apiUrl = useRuntimeConfig().public.API_BASE_URL;

        // change the state of loading to true
        this.loading = true;

        // update the old password with new one
        fetch(`${apiUrl}/auth/password/update`, {
          method: "POST",
          headers: {
            token: mainStore.token,
          },
          body: JSON.stringify({
            new_password: this.info.password,
            password: this.info.oldPassword,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            // check if there is any problem with api request show it in snackbar
            if (!data.success) mainStore.openSnackbar(data.error, "error");
            else {
              // if there is no problem then increase the step
              // and show success message in snackbar
              // and after 5 minute redirect user to /app
              this.step++;
              mainStore.openSnackbar(data.message, "success");
              setTimeout(() => navigateTo("/app"), 5000);
            }
          })
          .catch((err) => console.log("error:", err))
          .finally(() => (this.loading = false));
      }
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
      const route = useRouter().currentRoute.value.name;
      const stepOneTitle = route === "register" ? "Create Account" : "Login";
      return state.step === 0
        ? stepOneTitle
        : state.step === 1
        ? "Confirm Email"
        : "Done";
    },
    // Dynamic icon for the card based on the current step
    setTitleIcon: (state) => {
      const route = useRouter().currentRoute.value.name;
      const stepOneTitleIcon =
        route === "register" ? "mdi-account-plus" : "mdi-login";
      return state.step === 0
        ? stepOneTitleIcon
        : state.step === 1
        ? "mdi-email-fast"
        : "mdi-check";
    },
    getPercentageOfTimer: (state) => {
      return state.timer.timer / 3;
    },
    userPlaceInOrdinalForm() {
      const p = this.info.place;

      // Check if the number is between 10 and 20 (inclusive), as they have irregular ordinal forms.
      if (10 <= p % 100 && p % 100 <= 20) {
        return p + "th";
      } else {
        // Define ordinal suffixes for 1, 2, and 3.
        const suffixes = { 1: "st", 2: "nd", 3: "rd" };

        // Get the last digit of the number.
        const lastDigit = p % 10;

        // Use the suffixes object to check for special ordinal forms. Default to "th" if not found.
        return p + (suffixes[lastDigit] || "th");
      }
    },
  },
});
