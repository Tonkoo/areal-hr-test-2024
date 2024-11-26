<template>
  <v-dialog
    :model-value="deleteDialog"
    @update:model-value="$emit('update:deleteDialog', $event)"
    max-width="500px"
  >
    <v-card>
      <v-card-title class="headline">Уволить сотрудника</v-card-title>
      <v-card-text>
        Вы уверены, что хотите удалить аккаунт пользователя
        {{ LocalUser.last_name }} {{ LocalUser.first_name }}?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeDialog">Отмена</v-btn>
        <v-btn color="red darken-1" text @click="deleteUser">Уволить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import UsersApi from "../api/UsersApi";
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
  emits: ["update:deleteDialog", "delete"],
  methods: {
    closeDialog() {
      this.$emit("update:deleteDialog", false);
    },
    deleteUser() {
      UsersApi.deleteUser(this.LocalUser.id)
        .then(() => {
          this.closeDialog();
          this.$emit("delete");
        })
        .catch((err) => console.error(err));
    },
  },
};
</script>
