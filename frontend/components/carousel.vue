<template>
  <v-carousel
    class="h-100"
    cycle
    hide-delimiter-background
    :show-arrows="false"
    hide-delimiters
  >
    <v-carousel-item>
      <div class="left-side-bg" id="left-side-bg-one"></div>
      <p class="photo-credit text-caption">
        Photo by
        <a
          class="text-caption"
          target="_blank"
          href="https://unsplash.com/@hollymandarich?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
          >Holly Mandarich</a
        >
        on
        <a
          class="text-caption"
          target="_blank"
          href="https://unsplash.com/photos/UVyOfX3v0Ls?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
          >Unsplash</a
        >
      </p>
    </v-carousel-item>
    <v-carousel-item>
      <div class="left-side-bg" id="left-side-bg-two"></div>
      <p class="photo-credit text-caption">
        Photo by
        <a
          class="text-caption"
          target="_blank"
          href="https://unsplash.com/@ianchen0?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
          >Ian Chen</a
        >
        on
        <a
          class="text-caption"
          target="_blank"
          href="https://unsplash.com/photos/a-person-standing-in-a-cave-with-a-light-coming-through-wrrgZwI7qOY?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
          >Unsplash</a
        >
      </p>
    </v-carousel-item>
    <v-carousel-item>
      <div class="left-side-bg" id="left-side-bg-three"></div>
      <p class="photo-credit text-caption">
        Photo by
        <a
          class="text-caption"
          target="_blank"
          href="https://unsplash.com/@jeremybishop?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
          >Jeremy Bishop</a
        >
        on
        <a
          class="text-caption"
          target="_blank"
          href="https://unsplash.com/photos/man-holding-red-light-flare-inside-cave-4PwRZXbXKxY?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
          >Unsplash</a
        >
      </p>
    </v-carousel-item>
    <v-carousel-item>
      <div class="left-side-bg" id="left-side-bg-four"></div>
      <p class="photo-credit text-caption">
        Photo by
        <a
          class="text-caption"
          target="_blank"
          href="https://unsplash.com/@neom?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
          >NEOM</a
        >
        on
        <a
          class="text-caption"
          target="_blank"
          href="https://unsplash.com/photos/a-person-standing-in-front-of-a-mountain-yT7En_eUUnI?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
          >Unsplash</a
        >
      </p>
    </v-carousel-item>
  </v-carousel>
</template>

<style lang="sass" scoped>
.left-side-bg
  width: 100%
  height: 100%
  position: relative
.photo-credit
  position: absolute
  bottom: 5px
  left: 5px
  margin: auto
  padding: 5px 10px
  @media (max-width: $medium-screen)
    padding: 1px 5px
  border-radius: 25px
  background: rgba(22, 22, 26, 0.75)
  a
    color: #3399cc
    text-decoration: none
  a:hover
    text-decoration: underline

#left-side-bg-one
  background: url("../assets/images/holly-mandarich.jpg") center no-repeat
  background-size: cover
#left-side-bg-two
  background: url("../assets/images/ian-chen.jpg") center no-repeat
  background-size: cover
#left-side-bg-three
  background: url("../assets/images/jeremy-bishop.jpg") center no-repeat
  background-size: cover
#left-side-bg-four
  background: url("../assets/images/neom.jpg") center no-repeat
  background-size: cover
</style>
