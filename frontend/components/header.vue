<template>
  <div id="header">
    <div id="main">
      <h3>Trivia Quest</h3>
      <div id="links">
        <NuxtLink to="/login">
          <v-btn variant="text"> login </v-btn>
        </NuxtLink>
        <NuxtLink to="/register">
          <v-btn variant="tonal"> register </v-btn>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style lang="sass">
#header
  width: 100%
  height: 10%
  background: transparent
  display: flex
  align-items: center
  justify-content: center
  padding: 10px
  #main
    width: 100%
    height: 100%
    border-radius: 22.5px / 22.5px
    display: flex
    flex-direction: row
    align-items: center
    justify-content: space-between
    padding: 20px
  #links
    width: 200px
    display: flex
    align-items: center
    justify-content: space-between
</style>
