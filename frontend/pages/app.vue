<template>
  <!-- Main container -->
  <div id="container">
    <!-- Main content area -->
    <div
      id="main"
      class="d-flex flex-column align-center justify-center w-100 h-100"
    >
      <!-- Window component to toggle between different steps -->
      <v-window v-model="questions.step">
        <!-- Step 0 get questions info-->
        <v-window-item :value="0">
          <!-- Card containing question options -->
          <v-card
            :loading="questions.loading"
            id="select-card"
            class="rounded-xl"
          >
            <!-- Card title -->
            <v-card-title>
              <h1 class="text-h4 white-space-normal">Question Type Selector</h1>
            </v-card-title>
            <!-- Card subtitle -->
            <v-card-subtitle>
              <p class="text-subtitle-1">Customize Your Trivia Experience</p>
            </v-card-subtitle>
            <!-- Divider line -->
            <v-divider />
            <!-- Card content -->
            <v-card-text>
              <!-- Input field for number of questions -->
              <v-text-field
                type="number"
                :rules="[
                  (value) => Number(value) >= 1 || 'Should be more than 0',
                  (value) => Number(value) <= 20 || 'Should be less than 21',
                ]"
                label="Number of Questions:"
                variant="outlined"
                v-model="questions.info.amount"
              ></v-text-field>
              <!-- Dropdown for selecting category -->
              <v-select
                label="Select Category:"
                :items="questions.categoryList"
                variant="outlined"
                v-model="questions.info.category"
              ></v-select>
              <!-- Dropdown for selecting difficulty -->
              <v-select
                label="Select Difficulty:"
                :items="questions.difficultyList"
                variant="outlined"
                v-model="questions.info.difficulty"
              ></v-select>
              <!-- Dropdown for selecting question type -->
              <v-select
                label="Select Type:"
                :items="questions.typeList"
                variant="outlined"
                v-model="questions.info.type"
              ></v-select>
            </v-card-text>
            <v-card-actions>
              <v-btn
                :disabled="questions.loading"
                :loading="questions.loading"
                block
                variant="tonal"
                @click="questions.start"
                >Start</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-window-item>

        <!-- Step 1  main questions(game)-->
        <v-window-item :value="1"> </v-window-item>
      </v-window>
    </div>
  </div>
</template>

<script>
import { useQuestionsStore } from "~/store/questions";
import { useMainStore } from "../store/index";
export default {
  setup() {
    // Access the main store using Composition API
    const store = useMainStore();
    // Access the questions store using Composition API
    const questions = useQuestionsStore();
    return { store: store, questions: questions };
  },
  mounted() {
    // When the component is mounted, verify token and get username
    this.store.handleGameRouteChange();
  },
  beforeRouteLeave() {
    // Prevent route change, if token exist and token is valid
    this.store.handleGameRouteChange();
  },
};
</script>

<style lang="sass" scoped>
.white-space-normal
  white-space: normal
#select-card
  padding: 20px
  width: 500px
  @media (max-width: $small-screen)
    width: 95%

#container
  padding: 0 10px 10px 10px
  #main
    width: 100%
    height: 100%
    border-radius: 20px
    background: url("../assets/images/background-pattern.svg")
    background-position: center
</style>
