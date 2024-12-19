<template>
  <v-dialog
    :model-value="logOutDialog"
    @update:model-value="$emit('update:logOutDialog', $event)"
    max-width="500px"
  >
    <v-card>
      <v-card-title class="headline"
        >Подтверждение выхода из аккаунта</v-card-title
      >
      <v-card-text>Вы точно хотите выйти из аккаунта?</v-card-text>
      <v-card-actions>
        <v-btn color="blue" text @click="closeDialog">Отмена</v-btn>
        <v-btn color="red" text @click="logOut">Выйти из аккаунта</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import authorizationApi from "@/modules/authorization/api/authorization-api";

export default {
  props: {
    logOutDialog: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["update:logOutDialog"],
  methods: {
    closeDialog() {
      this.$emit("update:logOutDialog", false);
    },
    logOut() {
      authorizationApi
        .logOut()
        .then(() => {
          this.closeDialog();
        })
        .catch((err) => {
          console.error("Error logout:", err);
        });
    },
  },
};
</script>
