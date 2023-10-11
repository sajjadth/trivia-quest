<template>
  <!-- Main container -->
  <div id="main">
    <div id="body">
      <!-- Title section -->
      <div id="title">
        <div id="title-main">
          <!-- Main title -->
          <h1 class="text-h4">
            Trivia Quest: Where Knowledge Meets Adventure!
          </h1>
          <!-- Subtitle -->
          <p class="text-subtitle-1 text-justify">
            Step into the world of brain-teasing challenges and epic trivia
            battles! From pop culture to science, embark on a whirlwind journey
            of wit and wisdom. Test your skills, earn bragging rights, and let
            the quest for knowledge begin!
          </p>
        </div>
        <!-- Title image -->
        <div id="title-image"></div>
      </div>

      <!-- Right side content -->
      <div id="right-side">
        <!-- Question section -->
        <div id="question">
          <!-- Skeleton loader for when data is loading -->
          <VSkeletonLoader
            v-if="loading"
            class="mx-auto"
            :elevation="12"
            boilerplate
            width="400"
            type="heading, list-item-two-line, divider, paragraph, divider, 	button@2"
          ></VSkeletonLoader>

          <!-- Actual question card -->
          <v-card
            v-if="!finished"
            v-show="!loading"
            class="mx-auto"
            width="500"
            variant="text"
          >
            <v-card-item>
              <div>
                <!-- Question number -->
                <div class="text-overline mb-1">
                  Sample Play / Question #{{ index + 1 }}
                </div>
                <!-- Question text -->
                <div class="text-h6 mb-1">
                  {{ decodeHtml(samples[index].question) }}
                </div>
                <!-- Options for answers -->
                <div class="text-caption">
                  <v-chip-group
                    v-model="answer"
                    selected-class="text-info"
                    column
                  >
                    <v-chip
                      filter
                      v-for="(option, i) in samples[index].options"
                      :key="option"
                      :id="'option-' + i"
                    >
                      {{ decodeHtml(option) }}
                    </v-chip>
                  </v-chip-group>
                </div>
              </div>
            </v-card-item>

            <!-- Navigation buttons -->
            <v-card-actions class="justify-sm-space-between">
              <v-btn :disabled="index === 0" @click="previousQuestion">
                Back
              </v-btn>
              <v-btn variant="tonal" v-if="!checked" @click="checkAnswer">
                Check
              </v-btn>
              <v-btn
                variant="tonal"
                v-if="checked && index !== samples.length - 1"
                @click="nextQuestion"
              >
                Next
              </v-btn>
              <v-btn
                variant="tonal"
                v-if="index === samples.length - 1 && checked"
                @click="finishQuestion"
              >
                finish
              </v-btn>
            </v-card-actions>
          </v-card>

          <!-- Finished message -->
          <v-card
            v-if="finished"
            class="mx-auto"
            max-width="500"
            variant="text"
          >
            <v-card-item>
              <div>
                <!-- Success icon and message -->
                <div class="text-overline mb-1 text-success">
                  <span class="mdi mdi-check-bold"></span>
                  Done
                </div>
                <!-- Congratulatory message -->
                <div class="text-h4 mb-1">
                  Enjoyed the Game? Unlock More Fun!
                </div>
                <!-- Explanation text -->
                <div class="text-justify text-subtitle-1">
                  Congratulations on completing the 10-round sample game! If you
                  had a blast, imagine the excitement of a full-fledged Trivia
                  Quest! Sign In or register now to track your scores, challenge
                  friends, and embark on an epic journey of knowledge and fun.
                  Let the games begin!
                </div>
              </div>
            </v-card-item>

            <!-- Button to join -->
            <v-card-actions>
              <NuxtLink to="/register">
                <v-btn variant="text"> Join Us </v-btn>
              </NuxtLink>
            </v-card-actions>
          </v-card>
        </div>

        <!-- Image on the right side -->
        <img
          src="../assets/images/bloom-woman-thinking-about-the-problem.gif"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.text-justify
  text-align: justify !important
#main
  width: 100%
  height: 100%
  padding: 0 10px 10px 10px
  #body
    width: 100%
    height: 100%
    border-radius: 20px
    display: flex
    align-items: center
    justify-content: center
    flex-direction: row !important
    background: url("../assets/images/blob.svg") center no-repeat
    background-size: cover
    @media (max-width: $large-screen )
      flex-direction: column !important
    #title
      width: 100%
      height: 100%
      display: flex
      flex-direction: column
      align-items: center
      justify-content: flex-end
      overflow: hidden
      @media (max-width: $medium-screen)
        margin: 0
        justify-content: center !important
      &-main
        max-width: 500px
      &-image
        height: 375px
        width: 300px
        @media (max-width: $large-screen)
          display: none

    #right-side
      width: 100%
      height: 100%
      display: flex
      flex-direction: column
      align-items: center
      justify-content: flex-end
      overflow: hidden
      img
        width: 300px
        height: 400px
        user-select: none
        margin-bottom: -25px
      #question
        width: 500px
        height: auto
        display: flex
        align-items: center
        justify-content: center
        @media (max-width: $large-screen)
          display: none
        @media (max-height: $medium-screen)
          display: none
</style>

<script>
import { VSkeletonLoader } from "vuetify/labs/VSkeletonLoader";
export default {
  data() {
    return {
      index: 0,
      answer: null,
      checked: false,
      loading: !process.client,
      finished: false,
      samples: [
        {
          category: "Entertainment: Video Games",
          type: "multiple",
          difficulty: "medium",
          question:
            "Which of the following is NOT an official game in Nintendo&#039;s Super Smash Bros. series?",
          correct_answer: "Super Smash Bros. Crusade",
          options: [
            "Super Smash Bros. Melee",
            "Super Smash Bros. Crusade",
            "Super Smash Bros. Brawl",
            "Super Smash Bros. for Nintendo 3DS and Wii U",
          ],
        },
        {
          category: "Entertainment: Video Games",
          type: "multiple",
          difficulty: "medium",
          question:
            "What was the name of the Secret Organization in the Hotline Miami series? ",
          correct_answer: "50 Blessings",
          options: [
            "50 Blessings",
            "American Blessings",
            "50 Saints",
            "USSR&#039;s Blessings",
          ],
        },
        {
          category: "Entertainment: Japanese Anime & Manga",
          type: "multiple",
          difficulty: "medium",
          question:
            "In the anime Assassination Classroom what is the class that Korosensei teaches?",
          correct_answer: "Class 3-E",
          options: ["Class 3-A", "Class 3-E", "Class 3-B", "Class 3-D"],
        },
        {
          category: "History",
          type: "multiple",
          difficulty: "medium",
          question: "When did Norway become free from Sweden?",
          correct_answer: "1905",
          options: ["1925", "1814", "1834", "1905"],
        },
        {
          category: "Science: Computers",
          type: "multiple",
          difficulty: "medium",
          question:
            "Approximately how many Apple I personal computers were created?",
          correct_answer: "200",
          options: ["100", "500", "1000", "200"],
        },
        {
          category: "Geography",
          type: "multiple",
          difficulty: "medium",
          question: "What continent is the country Lesotho in?",
          correct_answer: "Africa",
          options: ["Asia", "Africa", "South America", "Europe"],
        },
        {
          category: "Entertainment: Film",
          type: "multiple",
          difficulty: "medium",
          question:
            "What film did James Cameron&#039;s Avatar dethrone as the highest-grossing film ever?",
          correct_answer: "Titanic",
          options: ["Star Wars", "Gone with the Wind", "Titanic", "Jaws"],
        },
        {
          category: "Entertainment: Television",
          type: "multiple",
          difficulty: "easy",
          question:
            "In the cartoon &#039;SpongeBob SquarePants&#039;, what did the acronym E.V.I.L stand for?",
          correct_answer: "Every Villain Is Lemons",
          options: [
            "Every Villain Is Lemons",
            "Every Villain Is Lemonade",
            "Every Villain Is Limes",
            "Each Villain Is Lemonade",
          ],
        },
        {
          category: "Science: Computers",
          type: "multiple",
          difficulty: "hard",
          question:
            "What type of sound chip does the Super Nintendo Entertainment System (SNES) have?",
          correct_answer: "ADPCM Sampler",
          options: [
            "FM Synthesizer",
            "Programmable Sound Generator (PSG)",
            "PCM Sampler",
            "ADPCM Sampler",
          ],
        },
        {
          category: "Geography",
          type: "multiple",
          difficulty: "medium",
          question:
            "Which of these countries is not a United Nations member state?",
          correct_answer: "Niue",
          options: ["Niue", "Tuvalu", "South Sudan", "Montenegro"],
        },
      ],
    };
  },
  methods: {
    // Function to decode HTML entities
    decodeHtml(input) {
      if (process.client) {
        let doc = new DOMParser().parseFromString(input, "text/html");
        return doc.documentElement.textContent;
      }
    },
    // Function to move to the next question
    nextQuestion() {
      this.checked = false;
      this.answer = null;
      this.index++;
    },
    // Function to move to the previous question
    previousQuestion() {
      this.checked = false;
      this.answer = null;
      this.index--;
    },
    // Function to check the user's answer
    checkAnswer() {
      const correctAnswerindex = this.samples[this.index].options.indexOf(
        this.samples[this.index].correct_answer
      );
      if (this.answer != null) {
        document
          .getElementById("option-" + correctAnswerindex)
          .classList.add("text-success");
        if (this.answer !== correctAnswerindex) {
          document
            .getElementById("option-" + this.answer)
            .classList.remove("text-info");
          document
            .getElementById("option-" + this.answer)
            .classList.add("text-error");
        }
        this.checked = true;
      }
    },
    // Function to finish the game
    finishQuestion() {
      this.finished = true;
    },
  },
  components: {
    VSkeletonLoader,
  },
};
</script>
