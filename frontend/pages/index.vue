<template>
  <!-- Main container for the landing page -->
  <div id="body" class="w-100 h-100">
    <!-- Container with rows for title and image -->
    <v-container id="container" class="h-100" fluid>
      <!-- Row for the title with a button -->
      <v-row class="h-25" no-gutters align="center" justify="center">
        <div class="w-100 d-flex flex-column align-center justify-center">
          <!-- Title with line breaks and a button to start the trivia journey -->
          <h1
            id="landing-title"
            class="font-weight-bold pa-10 d-flex flex-column align-start justify-end text-h1"
          >
            Embark on an
            <br />
            Epic Journey of
            <br />
            Wisdom with
            <br />
            Trivia Quest!
            <v-btn
              to="/register"
              id="join-btn"
              color="white"
              variant="text"
              rounded="lg"
            >
              Start Your Trivia Journey
            </v-btn>
          </h1>
        </div>
      </v-row>

      <!-- Row for the landing image -->
      <v-row id="landing-image" class="w-100 h-75 d-flex align-end justify-end">
        <div id="landing-img" class="w-100 h-100"></div>
      </v-row>
    </v-container>
  </div>
</template>

<style lang="sass" scoped>
#body
  padding-inline: 30px
  padding-bottom: 30px
  @media (max-width: $small-screen)
    padding-inline: 8px
    padding-bottom: 8px
  #container
    border-radius: 20px
    background: url("~/assets/images/layered-waves-haikei.svg") !important
    background-repeat: no-repeat !important
    background-position: center !important
    background-size: cover !important
    position: relative
    #join-btn
      z-index: 2
    #landing-title
      padding-bottom: 0 !important
      margin-bottom: 5px
      @media (max-width: $large-screen)
        font-size: 5rem !important
        line-height: 5rem !important
      @media (max-width: $medium-screen)
        padding: 40px 0 0 0 !important
        font-size: 4rem !important
        line-height: 4rem !important
      @media (max-width: $small-screen)
        font-size: 3rem !important
        line-height: 3rem !important
    #landing-subtitle
      @media (max-width: $small-screen)
        display: none
    #landing-image
      position: absolute
      right: 0
      bottom: 0
    #landing-img
      z-index: 1
      background: url("~/assets/images/matey-traveler-with-outstretched-arms.png") no-repeat bottom right
      background-size: contain
      @media (max-width: $extra-large-screen)
        // background: red
      @media (max-width: $large-screen)
        height: 90% !important
      @media (max-width: $medium-screen)
        height: 80% !important
      @media (max-width: $small-screen)
        justify-content: center
</style>
