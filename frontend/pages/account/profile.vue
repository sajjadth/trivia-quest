<template>
  <!-- Main container with centered content -->
  <v-container class="h-100 d-flex flex-column align-center justify-center">
    <!-- Card for displaying user profile information -->
    <v-card id="profile-card" rounded="xl">
      <!-- Card title with avatar icon -->
      <v-card-title class="text-center">
        <v-avatar size="150">
          <v-icon size="100" class="mdi mdi-account-circle"></v-icon>
        </v-avatar>
      </v-card-title>

      <!-- Card text fields for username, email, and score -->
      <v-card-text>
        <!-- Username field -->
        <v-text-field
          variant="underlined"
          prepend-inner-icon="mdi-at"
          disabled
          label="Username"
          v-model="store.info.username"
        />
        <!-- Email field -->
        <v-text-field
          variant="underlined"
          prepend-inner-icon="mdi-email-outline"
          disabled
          label="Email"
          v-model="store.info.email"
        />
        <!-- Section for place and score information -->
        <div
          class="d-flex flex-row align-center justify-space-between"
          id="score-section"
        >
          <!-- Place information -->
          <div id="place" class="d-flex align-center justify-center rounded-lg">
            <v-icon
              id="place-icon"
              :class="
                ('mdi',
                store.info.place === 1
                  ? 'mdi-podium-gold'
                  : store.info.place === 2
                  ? 'mdi-podium-silver'
                  : store.info.place === 3
                  ? 'mdi-podium-bronze'
                  : 'mdi-podium')
              "
              :color="
                store.info.place === 1
                  ? 'yellow-darken-3'
                  : store.info.place === 2
                  ? 'blue-grey-darken-1'
                  : store.info.place === 3
                  ? 'brown-lighten-1'
                  : ''
              "
              size="x-large"
              class="place-icon mdi mdi-podium"
            ></v-icon>
            <h1 class="text-h5">{{ store.userPlaceInOrdinalForm }} Place</h1>
          </div>

          <!-- Score information -->
          <div id="score" class="d-flex align-center justify-center rounded-lg">
            <v-icon
              id="score-icon"
              :color="
                store.info.place === 1
                  ? 'yellow-darken-3'
                  : store.info.place === 2
                  ? 'blue-grey-darken-1'
                  : store.info.place === 3
                  ? 'brown-lighten-1'
                  : ''
              "
              size="x-large"
              class="mdi mdi-star-three-points"
            ></v-icon>
            <h1 class="text-h5">Score: {{ store.info.score }}</h1>
          </div>
        </div>
      </v-card-text>

      <!-- Empty card text section -->
      <v-card-text> </v-card-text>

      <!-- Card actions section for logout and password edit buttons -->
      <v-card-actions class="d-flex flex-row align-center justify-space-around">
        <!-- Dialog for logout confirmation -->
        <v-dialog width="500">
          <template v-slot:activator="{ props }">
            <v-btn variant="text" color="error" v-bind="props" rounded="lg"
              >logout</v-btn
            >
          </template>

          <template v-slot:default="{ isActive }">
            <v-card rounded="xl">
              <v-card-text class="d-flex flex-row">
                <v-icon class="mdi mdi-exit-run icon-margin" />
                <h1 class="text-h5">Confirm Logout</h1>
              </v-card-text>
              <v-card-text>
                Are you sure you want to log out? Logging out will end your
                current session and you will need to sign in again to access
                your account.
              </v-card-text>

              <!-- Buttons for confirming or canceling logout -->
              <v-card-actions
                class="d-flex flex-row align-center justify-space-around"
              >
                <v-btn
                  text="Close"
                  @click="isActive.value = false"
                  rounded="lg"
                />
                <v-btn
                  text="Confirm"
                  color="error"
                  @click="store.logoutHandler"
                  rounded="lg"
                />
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>

        <!-- Button for editing password -->
        <v-btn variant="text" to="/account/password/update" rounded="lg">
          Edit Password
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { useUserStore } from "~/store/user";
export default {
  setup() {
    const store = useUserStore();
    return { store: store };
  },
  mounted() {
    // Call function to get user profile information
    this.store.getUserProfile();
  },
};
</script>

<style lang="sass" scoped>
.icon-margin
  margin-right: 10px
.v-card
  width: 500px
  padding: 28px 20px
  border: 1px #333333 solid
  @media (max-width: $medium-screen)
    padding: 8px 0 !important
  @media (max-width: $small-screen)
    width: 100%
  #score-section
    flex-direction: row
    @media (max-width: $small-screen)
      flex-direction: column !important
    #place,#score
      width: fit-content
      padding: 10px 20px
      border-radius: 20px
      background: #333333
      // background: $color-primary-darken-1
      @media (max-width: $small-screen)
        margin: 5px
      #place-icon,#score-icon
        margin-right: 10px
</style>
