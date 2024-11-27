<template>
  <v-container
    fluid
    class="d-flex flex-column"
    style="height: 100vh; padding: 0"
  >
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
    />

    <UsersDeleteDialog
      :deleteDialog="deleteDialog"
      :TableUsers="TableUsers"
      @update:deleteDialog="deleteDialog = $event"
      @delete="refreshUsers"
    />

    <UsersUpdateRoleDialog
      :updateRoleDialog="updateRoleDialog"
      :TableUsers="TableUsers"
      @update:updateRoleDialog="updateRoleDialog = $event"
      @save="refreshUsers"
    />

    <UsersTable
      ref="UsersTable"
      @edit="openEditDialog"
      @updateRole="openUpdateRoleDialog"
      @delete="openDeleteDialog"
      @reset="openResetPasswordDialog"
    />
  </v-container>
</template>

<script>
import UsersTable from "@/modules/users/components/UsersTable.vue";
import UsersForm from "@/modules/users/components/UsersForm.vue";
import UsersDeleteDialog from "@/modules/users/components/UsersDeleteDialog.vue";
import UsersUpdateRoleDialog from "@/modules/users/components/UsersUpdateRoleDialog.vue";

export default {
  components: {
    UsersTable,
    UsersForm,
    UsersDeleteDialog,
    UsersUpdateRoleDialog,
  },
  data() {
    return {
      dialog: false,
      isAddMode: false,
      isEditMode: false,
      deleteDialog: false,
      updateRoleDialog: false,
      resetPassword: false,
      TableUsers: {
        id: null,
        last_name: "",
        first_name: "",
        middle_name: "",
        login: "",
        password: "",
      },
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
  },
};
</script>

<style></style>
