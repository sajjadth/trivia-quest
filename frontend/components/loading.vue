<!-- This is a temporary loading component. It will be improved in the future. -->
<template>
  <!-- Main container for loading -->
  <div id="main" class="d-flex align-center justify-center w-100">
    <!-- Loading message with dynamic dots -->
    <h1 class="text-h4" id="loading">
      Loading <span id="loading-dots">{{ startLoading }}</span>
    </h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // Variable to hold the loading interval
      loadingInterval: null,
    };
  },
  computed: {
    startLoading() {
      let i = 1;
      // Update loading dots every second
      this.loadingInterval = setInterval(() => {
        const l = document.getElementById("loading-dots");
        if (i <= 2) {
          l.innerText += ".";
          i++;
        } else {
          l.innerText = ".";
          i = 1;
        }
      }, 1000);
    },
  },
  unmounted() {
    // After unmounting the component, clear the loading interval
    clearInterval(this.loadingInterval);
  },
};
</script>

<style lang="sass" scoped>
#main
    height: 100svh
    #loading
        display: flex
        width: 150px
        text-align: left
</style>
