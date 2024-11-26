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
      :isEditMode="isEditMode"
      :TableUsers="TableUsers"
      @update:dialog="dialog = $event"
      @save="refreshUsers"
    />

    <UsersDeleteDialog
      :deleteDialog="deleteDialog"
      :TableUsers="TableUsers"
      @update:deleteDialog="deleteDialog = $event"
      @delete="refreshUsers"
    />

    <UsersTable
      ref="UsersTable"
      @edit="openEditDialog"
      @delete="openDeleteDialog"
    />
  </v-container>
</template>

<script>
import UsersTable from "@/modules/users/components/UsersTable.vue";
import UsersForm from "@/modules/users/components/UsersForm.vue";
import UsersDeleteDialog from "@/modules/users/components/UsersDeleteDialog.vue";
export default {
  components: {
    UsersTable,
    UsersForm,
    UsersDeleteDialog,
  },
  data() {
    return {
      dialog: false,
      isEditMode: false,
      deleteDialog: false,
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
      this.TableUsers = [];
      this.isEditMode = false;
      this.dialog = true;
    },
    openEditDialog(item) {
      this.isEditMode = true;
      this.TableUsers = { ...item };
      this.dialog = true;
    },
    openDeleteDialog(item) {
      this.TableUsers = item;
      this.deleteDialog = true;
    },
  },
};
</script>

<style></style>
