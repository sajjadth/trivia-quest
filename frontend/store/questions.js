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
    user: {
      answer: null,
      answerChecked: false,
      correctAnswers: 0,
    },
    data: [],
    categoryList: ["Any Category"],
    categorysId: [0],
    difficultyList: ["Any Difficulty", "Easy", "Medium", "Hard"],
    typeList: ["Any Type", "Multiple Choice", "True / False"],
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
            mainStore.openSnackbar(data.error, "error");
          } else {
            // Set the fetched questions in the data property and increment the step to start game
            this.data = data.results;
            this.step++;
          }
        })
        .catch((err) => console.log("error:", err)) // Log any errors to the console
        .finally(() => (this.loading = false)); // Set loading back to false after request is complete
    },
    // 'check' action to check user answer with the correct answer by calling api
    check() {
      // Access the main store
      const mainStore = useMainStore();

      const apiUrl = useRuntimeConfig().public.API_BASE_URL;

      // check the user answer if there is a input
      if (this.user.answer) {
        //change the state of loading
        this.loading = true;

        // user answer
        const userAnswer =
          this.data[this.data.length - 1].options[this.user.answer];

        // correct answer
        const correctAnswer = this.data[this.data.length - 1].correct_answer;

        //check the user answer with correct answer by calling api
        fetch(`${apiUrl}/questions/check`, {
          method: "POST",
          headers: { token: mainStore.token },
          body: JSON.stringify({
            user_answer: userAnswer,
            correct_answer: correctAnswer,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (!data.success) {
              // show snackbar if there is error
              mainStore.openSnackbar(data.error, "error");
            } else {
              // get the users answer element
              const selectedOption = document.getElementById(
                `option-1${this.user.answer}`
              );

              // remove the text-info class from the user answer
              selectedOption.classList.remove("text-info");

              // if the user answer is same as correct answer add text-success class
              // and increase the correct answer by one
              if (data.result) {
                selectedOption.classList.add("text-success");
                this.user.correctAnswers++;
              }
              // if the user answer is not the same as correct answer add text-error class
              else selectedOption.classList.add("text-error");

              // change the answerChecked to true to prevent multiple api call
              this.user.answerChecked = true;
            }
          })
          .catch((err) => console.log("error:", err)) // catch any error
          .finally((this.loading = false)); // change the state of loading
      } else {
        // show error if there is no input and user trying to check
        mainStore.openSnackbar(
          "Please select an option before checking.",
          "error"
        );
      }
    },
    // 'next' action to transition to the next question
    next() {
      // Get the last question card element
      const lastCard = document.getElementById(`question-1`);

      // Check if the user's answer is correct by checking CSS class
      const isUserAnswerCorrect = document
        .getElementById(`option-1${this.user.answer}`)
        .classList.contains("text-success");

      // Apply animation based on correctness of user's answer
      if (isUserAnswerCorrect)
        lastCard.classList.add("next-question-card-correct-animation");
      else lastCard.classList.add("next-question-card-incorrect-animation");

      // Reset user's answer and answerChecked status
      this.user.answer = null;
      this.user.answerChecked = false;

      // Remove the last question card after animation is complete
      setTimeout(() => {
        this.data.pop();
      }, 375);
    },
  },
});
