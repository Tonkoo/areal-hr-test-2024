<template>
  <v-dialog
    :model-value="deleteDialog"
    @update:model-value="$emit('update:deleteDialog', $event)"
    max-width="500px"
  >
    <v-card>
      <v-card-title class="headline">Удалить сотрудника</v-card-title>
      <v-card-text>
        Вы уверены, что хотите удалить аккаунт пользователя
        {{ LocalUser.last_name }} {{ LocalUser.first_name }}?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeDialog">Отмена</v-btn>
        <v-btn color="red darken-1" text @click="deleteUser">Удалить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import UsersApi from "../api/users-api";
export default {
  props: {
    deleteDialog: {
      type: Boolean,
      required: true,
    },
    TableUsers: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      LocalUser: { ...this.TableUsers },
    };
  },
  watch: {
    TableUsers: {
      handler(newUser) {
        this.LocalUser = { ...newUser };
      },
      deep: true,
    },
  },
  emits: ["update:deleteDialog", "delete", "openSnackBar"],
  methods: {
    closeDialog() {
      this.$emit("update:deleteDialog", false);
    },
    deleteUser() {
      UsersApi.deleteUser(this.LocalUser.id)
        .then(() => {
          this.settingsSnackBar = {
            error: false,
            text: "Successfully",
          };
          this.$emit("openSnackBar", this.settingsSnackBar);
          this.closeDialog();
          this.$emit("delete");
        })
        .catch((err) => {
          this.settingsSnackBar = {
            error: true,
            text: err.status + ": " + err.response.statusText,
          };
          this.$emit("openSnackBar", this.settingsSnackBar);
        });
    },
  },
};
</script>
