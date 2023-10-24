import { defineStore } from "pinia";

export const useMainStore = defineStore("main", {
  state: () => ({
    token:
      localStorage.getItem("token") || sessionStorage.getItem("token") || null,
    username: null,
    sessionValid: false,
  }),
  actions: {
    verifyTokenAndGetUsername() {
      const route = useRouter().currentRoute.value.name;
      if (this.token) {
        const apiUrl = useRuntimeConfig().public.API_BASE_URL;
        fetch(`${apiUrl}/auth/verify`, {
          method: "POST",
          body: JSON.stringify({ token: this.token }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.valid) {
              this.sessionValid = true;
              this.username = data.username;
              navigateTo("/app");
            } else if (route === "app") {
              localStorage.clear();
              sessionStorage.clear();
              navigateTo("/login");
            }
          })
          .catch((err) => {
            console.log("error:", err);
          });
      } else {
        if (route === "app") navigateTo("/login");
      }
    },
  },
});
