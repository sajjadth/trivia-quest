import { defineStore } from "pinia";
import { useQuestionsStore } from "./questions";

export const useMainStore = defineStore("main", {
  state: () => ({
    // Initialize 'token' with the value from local storage or session storage, or null if neither is available
    token:
      localStorage.getItem("token") || sessionStorage.getItem("token") || null,
    username: null,
    sessionValid: false,
    loading: false,
  }),
  actions: {
    // Define an action named 'verifyTokenAndGetUsername'
    verifyTokenAndGetUsername() {
      // Verify session if session is not valid
      if (!this.sessionValid && this.token) {
        // Start loading
        this.loading = true;

        // Get the current route name using Vue Router
        const route = useRouter().currentRoute.value.name;

        // Check if a token is available
        if (this.token) {
          // If a token is available, proceed with verification
          const apiUrl = useRuntimeConfig().public.API_BASE_URL;

          // Access the questions store
          const questionsStore = useQuestionsStore();

          // Send a POST request to verify the token
          fetch(`${apiUrl}/auth/verify`, {
            method: "POST",
            body: JSON.stringify({ token: this.token }),
          })
            .then((res) => res.json())
            .then((data) => {
              // If verification is successful, update session status and username
              if (data.success && data.valid) {
                // If there is no category, fetch it from open trivia database
                if (
                  questionsStore.categoryList.length === 1 &&
                  questionsStore.categorysId.length === 1
                ) {
                  fetch("https://opentdb.com/api_category.php")
                    .then((res) => res.json())
                    .then((data) => {
                      let categorysId = [];
                      let categorysName = [];

                      // Separate the  name and id for better display
                      data.trivia_categories.forEach((c) => {
                        categorysId.push(c.id);
                        categorysName.push(c.name);
                      });

                      // Store separated data on questions
                      questionsStore.categoryList =
                        questionsStore.categoryList.concat(categorysName);
                      questionsStore.categorysId =
                        questionsStore.categorysId.concat(categorysId);
                    })
                    .catch((err) => console.log("error:", err))
                    .finally(() => (this.loading = false));
                }
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
      }
    },
    // If the user tries to exit the /app, don't allow it
    handleGameRouteChange() {
      if (this.sessionValid && this.token) {
        navigateTo("/app");
      }
    },
  },
});
