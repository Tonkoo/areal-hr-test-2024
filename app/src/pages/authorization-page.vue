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
          <v-card-text v-if="error.message" class="error-message red--text">
            {{ error.message }}
          </v-card-text>
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
                :error-messages="error.login"
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
                :error-messages="error.password"
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
import logoImage from "../assets/images/logo-authorization.svg";
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
      this.error = {};
      if (!this.localUser.login || !this.localUser.password) {
        if (!this.localUser.login)
          this.error.login = "Поле 'Логин' обязательно";
        if (!this.localUser.password)
          this.error.password = "Поле 'Пароль' обязательно";
      } else {
        authorizationApi
          .logIn({ ...this.localUser })
          .then(() => {
            this.error = {};
            this.localUser = {};
          })
          .catch((err) => {
            console.log(this.localUser);
            console.log("Error", err);
            this.error = { message: err.response.data.message };
          });
      }
    },
  },
};
</script>

<style>
.error-message {
  background-color: rgba(255, 91, 91, 0.3);
  color: red;
  border-radius: 10px;
  font-size: 14px;
  text-align: center;
}
</style>
