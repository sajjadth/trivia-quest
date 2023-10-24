import { defineStore } from "pinia";

export const useMainStore = defineStore("main", {
  state: () => ({
    // Initialize 'token' with the value from local storage or session storage, or null if neither is available
    token:
      localStorage.getItem("token") || sessionStorage.getItem("token") || null,
    username: null,
    sessionValid: false,
  }),
  actions: {
    // Define an action named 'verifyTokenAndGetUsername'
    verifyTokenAndGetUsername() {
      // Get the current route name using Vue Router
      const route = useRouter().currentRoute.value.name;

      // Check if a token is available
      if (this.token) {
        // If a token is available, proceed with verification
        const apiUrl = useRuntimeConfig().public.API_BASE_URL;

        // Send a POST request to verify the token
        fetch(`${apiUrl}/auth/verify`, {
          method: "POST",
          body: JSON.stringify({ token: this.token }),
        })
          .then((res) => res.json())
          .then((data) => {
            // If verification is successful, update session status and username
            if (data.success && data.valid) {
              this.sessionValid = true;
              this.username = data.username;
              navigateTo("/app");
            } else if (route === "app") {
              // If the route is '/app' and verification fails, clear storage and redirect to '/login'
              localStorage.clear();
              sessionStorage.clear();
              navigateTo("/login");
            }
          })
          .catch((err) => {
            console.log("error:", err);
          });
      } else {
        // If no token is available, redirect to '/login'
        if (route === "app") navigateTo("/login");
      }
    },
  },
});
