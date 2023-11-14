<template>
  <!-- Main container -->
  <div id="container" class="w-100 h-100">
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
            :disabled="questions.loading"
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
                variant="underlined"
                rounded="lg"
                v-model="questions.info.amount"
              ></v-text-field>
              <!-- Dropdown for selecting category -->
              <v-select
                label="Select Category:"
                :items="questions.categoryList"
                variant="underlined"
                rounded="lg"
                v-model="questions.info.category"
                class="text-field"
              ></v-select>
              <!-- Dropdown for selecting difficulty -->
              <v-select
                label="Select Difficulty:"
                :items="questions.difficultyList"
                variant="underlined"
                rounded="lg"
                v-model="questions.info.difficulty"
              ></v-select>
              <!-- Dropdown for selecting question type -->
              <v-select
                label="Select Type:"
                :items="questions.typeList"
                variant="underlined"
                rounded="lg"
                v-model="questions.info.type"
              ></v-select>
            </v-card-text>
            <v-card-actions>
              <v-btn
                :disabled="questions.loading"
                :loading="questions.loading"
                block
                variant="flat"
                rounded="lg"
                color="info"
                @click="questions.start"
              >
                Start
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-window-item>

        <!-- Step 1  main questions(game)-->
        <v-window-item
          class="w-100 h-100 d-flex flex-column align-center justify-center"
          :value="1"
        >
          <QuestionsCard />
        </v-window-item>
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
};
</script>

<style lang="sass" scoped>
#select-card
  padding: 20px
  width: 500px
  @media (max-width: $small-screen)
    width: fit-content
    margin: 8px

#container
  padding: 0 10px 10px 10px
  #main
    width: 100%
    height: 100%
    border-radius: 20px
    background: url("../assets/images/background-pattern.svg")
    background-position: center
    .v-card
      padding: 28px 20px
      @media(max-width: $small-screen)
        padding: 8px
      border: 1px #333333 solid
</style>
