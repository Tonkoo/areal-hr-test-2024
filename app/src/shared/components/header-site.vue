<template>
  <v-app-bar color="#1976d2" app>
    <v-toolbar-title>HR-Manager</v-toolbar-title>
    <span class="mr-4">
      {{ fullName }}
    </span>
    <v-btn icon @click="logOut">
      <v-icon>mdi-logout</v-icon>
    </v-btn>
  </v-app-bar>
  <dialogLogOut
    :logOutDialog="logOutDialog"
    @update:logOutDialog="logOutDialog = $event"
    @openSnackBar="openSnackBar"
  />

  <snackBar
    :snackbar="snackbar"
    @update:snackbar="snackbar = $event"
    :settingsSnackBar="localSettingsSnackBar"
  />
</template>

<script>
import dialogLogOut from "@/modules/logout/components/dialog-log-out.vue";
import authorizationApi from "@/modules/authorization/api/authorization-api";
import snackBar from "@/shared/components/snack-bar.vue";

export default {
  components: {
    dialogLogOut,
    snackBar,
  },
  data() {
    return {
      logOutDialog: false,
      fullName: "",
      snackbar: false,
      localSettingsSnackBar: {
        error: false,
        text: null,
      },
    };
  },
  async mounted() {
    this.getFullName();
  },
  methods: {
    async getFullName() {
      this.fullName = await authorizationApi.getUserFullName();
    },
    logOut() {
      this.logOutDialog = true;
    },
    openSnackBar(settingsSnackBar) {
      this.localSettingsSnackBar = settingsSnackBar;
      this.snackbar = true;
    },
  },
};
</script>

<style scoped>
.v-toolbar-title {
  font-size: 20px;
  font-weight: bold;
}
</style>
