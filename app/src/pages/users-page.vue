<template>
  <v-container fluid class="d-flex flex-column" style="padding: 0">
    <v-toolbar flat>
      <v-toolbar-title>Пользователи</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        color="deep-purple accent-4"
        @click="openAddDialog()"
        elevation="10"
        class="white--text"
        >Зарегистрировать пользователя</v-btn
      >
    </v-toolbar>

    <UsersForm
      :dialog="dialog"
      :isAddMode="isAddMode"
      :isEditMode="isEditMode"
      :TableUsers="TableUsers"
      :resetPassword="resetPassword"
      @update:dialog="dialog = $event"
      @save="refreshUsers"
      @openSnackBar="openSnackBar"
    />

    <UsersDeleteDialog
      :deleteDialog="deleteDialog"
      :TableUsers="TableUsers"
      @update:deleteDialog="deleteDialog = $event"
      @delete="refreshUsers"
      @openSnackBar="openSnackBar"
    />

    <UsersUpdateRoleDialog
      :updateRoleDialog="updateRoleDialog"
      :TableUsers="TableUsers"
      @update:updateRoleDialog="updateRoleDialog = $event"
      @save="refreshUsers"
      @openSnackBar="openSnackBar"
    />

    <historyDialog
      :historyDialog="historyDialog"
      :history="historyUser"
      @update:historyDialog="historyDialog = $event"
      @openSnackBar="openSnackBar"
    />

    <UsersTable
      ref="UsersTable"
      @edit="openEditDialog"
      @updateRole="openUpdateRoleDialog"
      @delete="openDeleteDialog"
      @reset="openResetPasswordDialog"
      @history="fetchHistoryUser"
      @openSnackBar="openSnackBar"
    />

    <snackBar
      :snackbar="snackbar"
      @update:snackbar="snackbar = $event"
      :settingsSnackBar="localSettingsSnackBar"
    />
  </v-container>
</template>

<script>
import usersApi from "@/modules/users/api/users-api";
import UsersTable from "@/modules/users/components/users-table.vue";
import UsersForm from "@/modules/users/components/users-form.vue";
import UsersDeleteDialog from "@/modules/users/components/users-delete-dialog.vue";
import UsersUpdateRoleDialog from "@/modules/users/components/users-update-role-dialog.vue";
import historyDialog from "@/shared/components/history-dialog.vue";
import snackBar from "@/shared/components/snack-bar.vue";

export default {
  components: {
    UsersTable,
    UsersForm,
    UsersDeleteDialog,
    UsersUpdateRoleDialog,
    historyDialog,
    snackBar,
  },
  data() {
    return {
      dialog: false,
      isAddMode: false,
      isEditMode: false,
      deleteDialog: false,
      historyDialog: false,
      updateRoleDialog: false,
      resetPassword: false,
      snackbar: false,
      localSettingsSnackBar: {
        error: false,
        text: null,
      },
      TableUsers: {
        id: null,
        last_name: "",
        first_name: "",
        middle_name: "",
        login: "",
        password: "",
      },
      historyUser: [],
    };
  },
  methods: {
    refreshUsers() {
      this.$refs.UsersTable.fetchUser();
    },
    openAddDialog() {
      this.resetPassword = false;
      this.isEditMode = false;
      this.isAddMode = true;
      this.TableUsers = [];
      this.dialog = true;
    },
    openEditDialog(item) {
      this.resetPassword = false;
      this.isAddMode = false;
      this.isEditMode = true;
      this.TableUsers = { ...item };
      this.dialog = true;
    },
    openDeleteDialog(item) {
      this.TableUsers = item;
      this.deleteDialog = true;
    },
    openResetPasswordDialog(item) {
      this.TableUsers = item;
      delete this.TableUsers.password;
      this.isAddMode = false;
      this.isEditMode = false;
      this.resetPassword = true;
      this.dialog = true;
    },
    openUpdateRoleDialog(item) {
      this.TableUsers = item;
      this.updateRoleDialog = true;
    },
    fetchHistoryUser(item) {
      console.log(item);

      usersApi
        .getHistoryUsers(item.id)
        .then((data) => {
          this.historyUser = data;
          this.historyDialog = true;
        })
        .catch((err) => {
          this.settingsSnackBar = {
            error: true,
            text: err.message,
          };
          this.openSnackBar(this.settingsSnackBar);
          this.historyUser = [];
        });
    },
    openSnackBar(settingsSnackBar) {
      this.localSettingsSnackBar = settingsSnackBar;
      this.snackbar = true;
    },
  },
};
</script>

<style></style>
