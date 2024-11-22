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

    <OrganizationTable
      ref="organizationTable"
      @edit="openEditDialog"
      @delete="openDeleteDialog"
    />
  </v-container>
</template>

<script>
import OrganizationForm from "@/modules/organizations/components/OrganizationForm.vue";
import OrganizationDeleteDialog from "@/modules/organizations/components/OrganizationDeleteDialog.vue";
import OrganizationTable from "@/modules/organizations/components/OrganizationTable.vue";

export default {
  components: {
    OrganizationForm,
    OrganizationDeleteDialog,
    OrganizationTable,
  },
  data() {
    return {
      dialog: false,
      isEditMode: false,
      deleteDialog: false,
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
      this.TableOrganization = { name: "", comment: "" };
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
  },
};
</script>

<style scoped>
.v-btn {
  margin-right: 8px;
}
</style>
