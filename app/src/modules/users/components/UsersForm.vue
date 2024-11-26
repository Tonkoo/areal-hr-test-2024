<template>
  <v-dialog
    :model-value="dialog"
    @update:model-value="$emit('update:dialog', $event)"
    max-width="700px"
  >
    <v-card>
      <v-card-title class="headline">{{
        isEditMode
          ? "Изменить данные пользователя"
          : "Добавить данные пользователя"
      }}</v-card-title>
      <v-form ref="form">
        <v-card-text>
          <v-text-field
            v-model="localUsers.last_name"
            label="Фамилия"
            :error-messages="errors.last_name"
            required
          ></v-text-field>
          <v-text-field
            v-model="localUsers.first_name"
            label="Имя"
            :error-messages="errors.first_name"
            required
          ></v-text-field>
          <v-text-field
            v-model="localUsers.middle_name"
            label="Отчество"
            :error-messages="errors.middle_name"
            required
          ></v-text-field>
          <v-text-field
            v-model="localUsers.login"
            label="Логин"
            :error-messages="errors.login"
            required
          ></v-text-field>
          <v-text-field
            v-model="localUsers.password"
            label="Пароль"
            :error-messages="errors.password"
            required
          ></v-text-field>
        </v-card-text>
      </v-form>
      <v-card-actions>
        <v-btn color="blue" text @click="closeDialog">Отмена</v-btn>
        <v-btn color="blue" text @click="saveUsers">
          {{ isEditMode ? "Сохранить" : "Добавить" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import UsersApi from "../api/UsersApi";
export default {
  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
    isEditMode: {
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
      localUsers: { ...this.TableUsers },
      errors: {},
    };
  },
  watch: {
    TableUsers: {
      handler(newUsers) {
        this.localUsers = { ...newUsers };
      },
      deep: true,
    },
  },
  emits: ["update:dialog", "save"],
  methods: {
    closeDialog() {
      this.errors = [];
      this.$emit("update:dialog", false);
    },
    saveUsers() {},
  },
};
</script>
