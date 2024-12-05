<template>
  <v-container
    fluid
    class="d-flex flex-column"
    style="height: 100vh; padding: 0"
  >
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
    />

    <OrganizationDeleteDialog
      :deleteDialog="deleteDialog"
      :deleteOrganizationId="deleteOrganizationId"
      @update:deleteDialog="deleteDialog = $event"
      @delete="refreshOrganizations"
    />

    <OrganizationHistoryDialog
      :historyDialog="historyDialog"
      :organization="TableOrganization"
      @update:historyDialog="historyDialog = $event"
    />

    <OrganizationTable
      ref="organizationTable"
      @edit="openEditDialog"
      @delete="openDeleteDialog"
      @history="openHistoryDialog"
    />
  </v-container>
</template>

<script>
import OrganizationForm from "@/modules/organizations/components/organization-form.vue";
import OrganizationDeleteDialog from "@/modules/organizations/components/organization-delete-dialog.vue";
import OrganizationTable from "@/modules/organizations/components/organization-table.vue";
import OrganizationHistoryDialog from "@/modules/organizations/components/organization-history-dialog.vue";

export default {
  components: {
    OrganizationForm,
    OrganizationDeleteDialog,
    OrganizationTable,
    OrganizationHistoryDialog,
  },
  data() {
    return {
      dialog: false,
      isEditMode: false,
      deleteDialog: false,
      historyDialog: false,
      deleteOrganizationId: 0,
      TableOrganization: {
        id: null,
        name: "",
        comment: "",
      },
      organizations: [],
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
    openHistoryDialog(item) {
      this.TableOrganization = item;
      this.historyDialog = true;
    },
  },
};
</script>

<style scoped>
.v-btn {
  margin-right: 8px;
}
</style>
