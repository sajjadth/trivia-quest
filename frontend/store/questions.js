import { defineStore } from "pinia";

export const useQuestionsStore = defineStore("questions", {
  state: () => ({
    info: {
      amount: 10,
      category: "Any Category",
      difficulty: "Any Difficulty",
      type: "Any Type",
    },
    categoryList: [],
    categorysId: [],
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
});
