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

  if ((isPathInAcceptablePaths || store.token) && !store.sessionValid) {
    // change the state of loading to true
    store.$patch({ loading: true });
  }

  // Verify session if session is not valid
  if (store.token && store.sessionValid) {
    // if the destination is /app or /account/password or /account/password/update do nothing
    if (isPathInAcceptablePaths) return;
    else {
      // if nuxt is ready then change the state of loading to false
      onNuxtReady(() => {
        store.$patch({ loading: false });
      });
      return navigateTo("/app");
    }
  } else {
    if (store.token) {
      // Access the questions store
      const questionsStore = useQuestionsStore();
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
      store.$patch({ username: localStorage.getItem("username") } as any);

      if (isPathInAcceptablePaths) return;
      else return navigateTo("/app");
    } else {
      // If there is no token and the user wants to access routes
      // that require a token, redirect the user to /login
      if (isPathInAcceptablePaths) return navigateTo("/login");

      // if nuxt is ready then change the state of loading to false
      onNuxtReady(() => {
        store.$patch({ loading: false });
      });
    }
  }
});
