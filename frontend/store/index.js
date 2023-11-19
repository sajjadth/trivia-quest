import { defineStore } from "pinia";

export const useMainStore = defineStore("main", {
  state: () => ({
    // Initialize 'token' with the value from local storage or session storage, or null if neither is available
    token:
      JSON.parse(localStorage.getItem("token")) ||
      JSON.parse(sessionStorage.getItem("token")) ||
      null,
    username: null,
    sessionValid: false,
    loading: false,
    snackbar: {
      stat: false,
      message: "",
      color: "",
    },
    isBackendReady: false,
  }),
  actions: {
    // 'openSnackbar' action to show a snackbar message
    openSnackbar(message, color) {
      this.snackbar.color = color;
      this.snackbar.message = message;
      this.snackbar.stat = true;
    },
    // 'closeSnackbar' action to close the snackbar
    closeSnackbar() {
      this.snackbar.stat = false;
      this.snackbar.message = "";
      this.snackbar.color = "";
    },
    // check the status of backend
    checkBackendStatus() {
      // change the state of loading to true
      this.loading = true;

      // fetch for checking the status of backend
      fetch("https://trivia-quest.sajjadth.workers.dev/backend/check", {
        method: "get",
      })
        .then((res) => res.json())
        .then((data) => {
          // stora status of backend
          this.isBackendReady = data.status === 200;
        })
        .catch((err) => console.log("error:", err))
        .finally(() => {
          console.log(this.isBackendReady);
          // if backend is not up and running then use demo version of app
          if (!this.isBackendReady)
            this.token =
              JSON.parse(localStorage.getItem("loggedIn")) ||
              JSON.parse(sessionStorage.getItem("loggedIn")) ||
              null;

          this.loading = false;
        });
    },
  },
});
