<template>
  <v-container fluid class="d-flex flex-column" style="padding: 0">
    <v-toolbar flat>
      <v-toolbar-title>Организации</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        color="deep-purple accent-4"
        @click="openAddDialog"
        elevation="10"
        class="white--text"
      >
        Добавить
      </v-btn>
    </v-toolbar>

    <OrganizationForm
      :dialog="dialog"
      :isEditMode="isEditMode"
      :organization="TableOrganization"
      @update:dialog="dialog = $event"
      @save="refreshOrganizations"
      @openSnackBar="openSnackBar"
    />

    <OrganizationDeleteDialog
      :deleteDialog="deleteDialog"
      :deleteOrganizationId="deleteOrganizationId"
      @update:deleteDialog="deleteDialog = $event"
      @delete="refreshOrganizations"
      @openSnackBar="openSnackBar"
    />

    <historyDialog
      :historyDialog="historyDialog"
      :history="historyOrganization"
      @update:historyDialog="historyDialog = $event"
    />

    <OrganizationTable
      ref="organizationTable"
      @edit="openEditDialog"
      @delete="openDeleteDialog"
      @history="fetchHistoryOrganizations"
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
import OrganizationsApi from "@/modules/organizations/api/organizations-api";
import OrganizationForm from "@/modules/organizations/components/organization-form.vue";
import OrganizationDeleteDialog from "@/modules/organizations/components/organization-delete-dialog.vue";
import OrganizationTable from "@/modules/organizations/components/organization-table.vue";
import historyDialog from "@/shared/components/history-dialog.vue";
import snackBar from "@/shared/components/snack-bar.vue";

export default {
  components: {
    OrganizationForm,
    OrganizationDeleteDialog,
    OrganizationTable,
    historyDialog,
    snackBar,
  },
  data() {
    return {
      dialog: false,
      isEditMode: false,
      deleteDialog: false,
      historyDialog: false,
      snackbar: false,
      localSettingsSnackBar: {
        error: false,
        text: null,
      },
      deleteOrganizationId: 0,
      TableOrganization: {
        id: null,
        name: "",
        comment: "",
      },
      organizations: [],
      historyOrganization: [],
    };
  },
  methods: {
    refreshOrganizations() {
      this.$refs.organizationTable.fetchOrganizations();
    },
    openAddDialog() {
      this.isEditMode = false;
      this.TableOrganization = [];
      this.dialog = true;
    },
    openEditDialog(item) {
      this.isEditMode = true;
      this.TableOrganization = { ...item };
      this.dialog = true;
    },
    openDeleteDialog(id) {
      this.deleteOrganizationId = id;
      this.deleteDialog = true;
    },
    fetchHistoryOrganizations(item) {
      OrganizationsApi.getHistoryOrganizations(item.id)
        .then((data) => {
          this.historyOrganization = data;
          this.historyDialog = true;
        })
        .catch((err) => {
          this.settingsSnackBar = {
            error: true,
            text: err.message,
          };
          this.openSnackBar(this.settingsSnackBar);
          this.historyOrganization = [];
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
