import { defineStore } from "pinia";

export const useMainStore = defineStore("main", {
  state: () => ({
    // Initialize 'token' with the value from local storage or session storage, or null if neither is available
    token:
      localStorage.getItem("token") || sessionStorage.getItem("token") || null,
    username: null,
    sessionValid: false,
    loading: false,
    snackbar: {
      stat: false,
      message: "",
      color: "",
    },
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
  },
});
