<template>
  <v-container class="fill-height">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="5">
        <v-img class="mx-auto my-6" max-width="228" :src="logoImage"></v-img>
        <v-card
          class="mx-auto pa-12 pb-8"
          elevation="8"
          max-width="448"
          rounded="lg"
        >
          <v-card-text>
            <v-form ref="form">
              <div class="text-subtitle-1 text-medium-emphasis">Account</div>
              <v-text-field
                v-model="localUser.login"
                density="compact"
                placeholder="Login"
                prepend-inner-icon="mdi-account-outline"
                variant="outlined"
                autocomplete="username"
              />
              <div
                class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
              >
                Password
              </div>

              <v-text-field
                v-model="localUser.password"
                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visible ? 'text' : 'password'"
                density="compact"
                placeholder="Enter your password"
                prepend-inner-icon="mdi-lock-outline"
                variant="outlined"
                autocomplete="current-password"
                @click:append-inner="visible = !visible"
              />
            </v-form>
          </v-card-text>

          <v-btn
            class="mb-8"
            color="blue"
            size="large"
            variant="tonal"
            block
            @click="logIn"
            >Log In</v-btn
          >
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import logoImage from "../assets/images/LogoAuthorization.svg";
import authorizationApi from "@/modules/authorization/api/authorization-api";

export default {
  data() {
    return {
      visible: false,
      logoImage,
      localUser: { login: "", password: "" },
      error: {},
    };
  },
  methods: {
    logIn() {
      authorizationApi
        .logIn({ ...this.localUser })
        .then(() => {
          console.log("Победа");
        })
        .catch((err) => {
          console.log("Error", err);
        });
    },
  },
};
</script>

<style></style>
