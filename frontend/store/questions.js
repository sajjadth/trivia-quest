import { defineStore } from "pinia";
import { useMainStore } from ".";
import confetti from "canvas-confetti";

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
    // start quest when status of backend is 200
    startWithBackend() {
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
          amount: Number(this.info.amount),
          category:
            this.categorysId[this.categoryList.indexOf(this.info.category)],
          difficulty:
            this.info.difficulty === "Any Difficulty"
              ? ""
              : this.info.difficulty.toLocaleLowerCase(), // Convert difficulty to lowercase if not "Any Difficulty"
          question_type:
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
    // start quest when status of backend is 503
    startWithoutBackend() {
      // Set loading to true
      this.loading = true;

      // Access the main store
      const mainStore = useMainStore();

      const amount =
        this.info.amount >= 20 && this.info.amount <= 1 ? this.info.amount : 10;
      const type =
        this.info.type === "True / False"
          ? "boolean"
          : this.info.type === "Multiple Choice"
          ? "multiple"
          : "";
      const difficulty =
        this.info.difficulty === "Any Difficulty"
          ? ""
          : this.info.difficulty.toLocaleLowerCase();

      // Send a POST request to fetch questions
      fetch(
        `https://opentdb.com/api.php?amount=${amount}&category=${
          this.categorysId[this.categoryList.indexOf(this.info.category)]
        }&difficulty=${difficulty}&type=${type}`,
        {
          method: "GET",
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.response_code !== 0) {
            // Open a snackbar with error message if request is not successful
            mainStore.openSnackbar(data.error, "error");
          } else {
            data.results.map((res) => {
              res.correctAnswer = res.correct_answer;
              if (res.type === "multiple") {
                var index = Math.floor(Math.random() * 4);
                res.options = res.incorrect_answers;
                if (index === 3) res.options.push(res.correct_answer);
                else {
                  res.options.push(res.options[index]);
                  res.options[index] = res.correct_answer;
                }
              } else {
                res.options = ["True", "False"];
              }
              delete res.incorrect_answers;
              delete res.correct_answer;
            });

            // Set the fetched questions in the data property and increment the step to start game
            this.data = data.results;
            this.step++;
          }
        })
        .catch((err) => console.log("error:", err)) // Log any errors to the console
        .finally(() => (this.loading = false)); // Set loading back to false after request is complete
    },
    // 'start' action to fetch questions and start the game
    start() {
      // access the main store
      const mainStore = useMainStore();

      if (mainStore.isBackendReady) this.startWithBackend();
      else this.startWithoutBackend();
    },
    // check the answer when status of backend is 200
    checkWithBackend() {
      // Access the main store
      const mainStore = useMainStore();

      const apiUrl = useRuntimeConfig().public.API_BASE_URL;

      // check the user answer if there is a input
      if (this.user.answer !== null) {
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
    // check the answer when status of backend is 503
    checkWithoutBackend() {
      // Access the main store
      const mainStore = useMainStore();

      // check the user answer if there is a input
      if (this.user.answer !== null) {
        // user answer
        const userAnswer =
          this.data[this.data.length - 1].options[this.user.answer];

        // correct answer
        const correctAnswer = this.data[this.data.length - 1].correctAnswer;

        // get the users answer element
        const selectedOption = document.getElementById(
          `option-1${this.user.answer}`
        );

        // remove the text-info class from the user answer
        selectedOption.classList.remove("text-info");

        // if the user answer is same as correct answer add text-success class
        // and increase the correct answer by one
        if (correctAnswer === userAnswer) {
          selectedOption.classList.add("text-success");
          localStorage.setItem(
            "score",
            JSON.parse(localStorage.getItem("score")) + 1
          );
          this.user.correctAnswers++;
        }
        // if the user answer is not the same as correct answer add text-error class
        else selectedOption.classList.add("text-error");

        // change the answerChecked to true to prevent multiple api call
        this.user.answerChecked = true;
      } else {
        // show error if there is no input and user trying to check
        mainStore.openSnackbar(
          "Please select an option before checking.",
          "error"
        );
      }
    },
    // 'check' action to check user answer with the correct answer by calling api
    check() {
      // access the main store
      const mainStore = useMainStore();

      if (mainStore.isBackendReady) this.checkWithBackend();
      else this.checkWithoutBackend();
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
        // show confetti if there is no more questions
        if (this.data.length === 1)
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        this.data.pop();
      }, 375);
    },
    // 'backToQuest' action reset the store
    backToQuest() {
      this.$reset();
    },
  },
});
