import { defineStore } from "pinia";
import { useMainStore } from ".";

export const useQuestionsStore = defineStore("questions", {
  state: () => ({
    step: 0,
    info: {
      amount: 10,
      category: "Any Category",
      difficulty: "Any Difficulty",
      type: "Any Type",
    },
    data: [],
    categoryList: ["Any Category"],
    categorysId: [0],
    difficultyList: ["Any Difficulty", "Easy", "Medium", "Hard"],
    typeList: ["Any Type", "Multiple Choice", "True / False"],
    snackbar: {
      stat: false,
      message: "",
      color: "",
    },
    loading: false,
  }),
  actions: {
    // 'start' action to fetch questions and start the game
    start() {
      // Set loading to true
      this.loading = true;

      // Access the main store
      const mainStore = useMainStore();

      // Get the API base URL from runtime config
      const apiUrl = useRuntimeConfig().public.API_BASE_URL;

      // Send a POST request to fetch questions
      fetch(`${apiUrl}/questions/get`, {
        method: "POST",
        headers: {
          token: mainStore.token, // Include the token from main store in the request headers
        },
        body: JSON.stringify({
          amount: this.info.amount,
          category:
            this.categorysId[this.categoryList.indexOf(this.info.category)],
          difficulty:
            this.info.difficulty === "Any Difficulty"
              ? ""
              : this.info.difficulty.toLocaleLowerCase(), // Convert difficulty to lowercase if not "Any Difficulty"
          type:
            this.info.type === "Multiple Choice"
              ? "multiple"
              : this.info.type === "True / False"
              ? "boolean"
              : "", // Set the question type in the request body
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.success) {
            // Open a snackbar with error message if request is not successful
            this.openSnackbar(data.error, "error");
          } else {
            // Set the fetched questions in the data property and increment the step to start game
            this.data = data.results;
            this.step++;
          }
        })
        .catch((err) => console.log("error:", err)) // Log any errors to the console
        .finally(() => (this.loading = false)); // Set loading back to false after request is complete
    },
    // 'openSnackbar' action to show a snackbar message
    openSnackbar(message, color) {
      this.snackbar.color = color;
      this.snackbar.message = message;
      this.snackbar.stat = true;
    },
    // 'closeSnackbar' action to close the snackbar
    closeSnackbar() {
      this.snackbar.stat = false;
      this.snackbar.color = "";
      this.snackbar.message = "";
    },
  },
});
