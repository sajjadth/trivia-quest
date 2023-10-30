<template>
  <div class="d-flex flex-column align-center justify-center" id="main">
    <!-- A container div with flexbox properties -->
    <v-card
      variant="elevated"
      v-for="(question, index) in questions.data"
      :loading="questions.loading"
      class="rounded-xl question-card d-flex flex-column align-start justify-space-between"
      :title="`Question #${questions.data.length - index}`"
      prepend-icon="mdi-help"
      width="500px"
    >
      <!-- Card subtitle -->
      <v-card-subtitle>
        <!-- Subtitle section within the card -->
        <v-tooltip location="top" text="Category">
          <!-- Tooltip for displaying category information -->
          <template v-slot:activator="{ props }">
            <!-- Slot for tooltip activator -->
            <v-chip v-bind="props" class="about-question" color="info">
              <!-- A chip component displaying the question category -->
              {{ question.category }}
            </v-chip>
          </template>
        </v-tooltip>
        <!-- Tooltip for displaying difficulty information -->
        <v-tooltip location="top" text="Difficulty">
          <template v-slot:activator="{ props }">
            <!-- Slot for tooltip activator -->
            <v-chip
              v-bind="props"
              class="about-question"
              :color="
                question.difficulty === 'easy'
                  ? 'success'
                  : question.difficulty === 'medium'
                  ? 'warning'
                  : 'error'
              "
            >
              <!-- A chip component displaying the question difficulty -->
              {{ question.difficulty }}
            </v-chip>
          </template>
        </v-tooltip>
      </v-card-subtitle>
      <!-- Card title -->
      <v-card-title>
        <!-- Title section within the card -->
        <h1 class="text-h6 white-space-normal">
          <!-- Heading element displaying the decoded HTML question -->
          {{ decodeHtml(question.question) }}
        </h1>
      </v-card-title>
      <!-- Card content -->
      <v-card-item class="w-100 d-flex flex-row align-center justify-center">
        <!-- Item section within the card, for displaying options -->
        <v-chip-group selected-class="text-info" column>
          <!-- A group of chips for displaying options -->
          <v-chip
            filter
            v-for="(option, i) in question.options"
            :key="option"
            :id="'option-' + i"
          >
            <!-- Individual chip for an option -->
            {{ decodeHtml(option) }}
          </v-chip>
        </v-chip-group>
      </v-card-item>
      <!-- Actions section within the card -->
      <v-card-actions class="w-100">
        <v-btn block variant="tonal">Check</v-btn>
        <!-- A button for checking the answer -->
        <!-- <v-btn block variant="tonal">Next</v-btn> -->
        <!-- A commented-out button for moving to the next question -->
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { useQuestionsStore } from "~/store/questions";

export default {
  setup() {
    const questions = useQuestionsStore();
    return { questions: questions };
  },
  methods: {
    // Function to decode HTML entities
    decodeHtml(input) {
      if (process.client) {
        let doc = new DOMParser().parseFromString(input, "text/html");
        return doc.documentElement.textContent;
      }
    },
  },
};
</script>

<style lang="sass" scoped>
.white-space-normal
    white-space: normal
#main
  position: relative
  z-index: 0
  width: 600px
  height: 600px
  .question-card
    width: 600px !important
    height: 400px !important
    padding: 20px
    height: fit-content
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    margin: auto
    &:nth-child(even)
      transform: rotate(7.5deg) translateY(-7.5px)
    &:nth-child(odd)
      transform: rotate(-7.5deg) translateY(-7.5px)
    &:last-child
      transform: none !important

    .about-question
      margin: 5px
</style>
