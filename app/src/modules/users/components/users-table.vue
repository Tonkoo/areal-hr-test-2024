<template>
  <v-table>
    <thead>
      <tr>
        <th>Код</th>
        <th>Фамилия</th>
        <th>Имя</th>
        <th>Отчество</th>
        <th>Логин</th>

        <th>Действие</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in users" :key="item.id">
        <td>{{ item.id }}</td>
        <td>{{ item.last_name }}</td>
        <td>{{ item.first_name }}</td>
        <td>{{ item.middle_name }}</td>
        <td>{{ item.login }}</td>
        <td>
          <v-btn color="blue" @click="openEditDialog(item)" small
            >Изменить</v-btn
          >
          <v-btn color="blue" @click="openUpdateRoleDialog(item)" small
            >Повысить роль</v-btn
          >
          <v-btn color="blue" @click="openResetPasswordDialog(item)" small
            >Сбросить пароль</v-btn
          >
          <v-btn color="red" @click="openDeleteDialog(item)" small
            >Удалить</v-btn
          >
          <v-btn color="blue" @click="openHistoryDialog(item)" small
            >История</v-btn
          >
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script>
import UsersApi from "../api/users-api";
export default {
  data() {
    return {
      users: [],
    };
  },
  mounted() {
    this.fetchUser();
  },
  methods: {
    fetchUser() {
      UsersApi.getUsers()
        .then((data) => {
          this.users = data;
        })
        .catch((err) => {
          this.settingsSnackBar = {
            error: true,
            text: err.status + ": " + err.response.statusText,
          };
          this.$emit("openSnackBar", this.settingsSnackBar);
          this.users = [];
        });
    },
    openEditDialog(item) {
      this.$emit("edit", item);
    },
    openDeleteDialog(item) {
      this.$emit("delete", item);
    },
    openResetPasswordDialog(item) {
      this.$emit("reset", item);
    },
    openUpdateRoleDialog(item) {
      this.$emit("updateRole", item);
    },
    openHistoryDialog(item) {
      this.$emit("history", item);
    },
  },
};
</script>
<style scoped>
.v-btn {
  margin-right: 8px;
}
</style>
