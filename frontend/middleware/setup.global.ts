import { useMainStore } from "~/store";
import { useQuestionsStore } from "~/store/questions";

export default defineNuxtRouteMiddleware((to, from) => {
  // check for acceptable paths
  const isPathInAcceptablePaths =
    to.path === "/app" ||
    to.path === "/account/profile" ||
    to.path === "/account/password/update";

  // Access the main store
  const store = useMainStore();

  // Verify session if session is not valid
  if (store.token && store.sessionValid) {
    // if the destination is /app or /account/password or /account/password/update do nothing
    if (isPathInAcceptablePaths) return;
    else {
      return navigateTo("/app");
    }
  } else {
    if (store.token) {
      // change the state of loading to true
      store.$patch({ loading: true });

      // If a token is available, proceed with verification
      const apiUrl = useRuntimeConfig().public.API_BASE_URL;

      // Access the questions store
      const questionsStore = useQuestionsStore();

      // Send a POST request to verify the token
      fetch(`${apiUrl}/auth/verify`, {
        method: "POST",
        body: JSON.stringify({ token: store.token }),
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
                  let categorysId: any = [];
                  let categorysName: any = [];

                  // Separate the  name and id for better display
                  data.trivia_categories.forEach((c: any) => {
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
                .finally(() => store.$patch({ loading: false }));
            }
            store.$patch({ sessionValid: true });
            store.$patch({ username: data.username });

            if (isPathInAcceptablePaths) return;
            navigateTo("/app");
          } else if (to.name === "app") {
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
      // If there is no token and the user wants to access routes
      // that require a token, redirect the user to /login
      if (isPathInAcceptablePaths) {
        return navigateTo("/login");
      }
    }
  }
});
