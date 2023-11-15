<!-- This is a temporary loading component. It will be improved in the future. -->
<template>
  <!-- Main container for loading -->
  <v-container fluid id="main" class="w-100 d-flex align-center justify-center">
    <span id="loading"></span>
  </v-container>
  <p id="credit" class="d-flex align-center justify-center w-100">
    Icons by &nbsp;
    <a href="https://lordicon.com/" target="_blank"> Lordicon </a>
  </p>
</template>

<style lang="sass" scoped>
#main
  height: 100vh
  #loading
    width: 100px
    height: 100px
    background: url("~/assets/images/main-loading-animation.gif") no-repeat center
    background-size: contain
#credit
  position: absolute
  bottom: 1%
</style>
