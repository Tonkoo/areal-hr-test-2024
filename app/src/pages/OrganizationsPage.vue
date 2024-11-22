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
      @save="handleSaveOrganization"
    />

    <OrganizationDeleteDialog
      :deleteDialog="deleteDialog"
      @update:deleteDialog="deleteDialog = $event"
      @delete="deleteOrganization"
    />

    <OrganizationTable
      :organizations="organizations"
      @edit="openEditDialog"
      @delete="openDeleteDialog"
    />
  </v-container>
</template>

<script>
import OrganizationForm from "@/modules/organizations/components/OrganizationForm.vue";
import OrganizationDeleteDialog from "@/modules/organizations/components/OrganizationDeleteDialog.vue";
import OrganizationTable from "@/modules/organizations/components/OrganizationTable.vue";
import OrganizationsApi from "@/modules/organizations/api/OrganizationsApi";

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
      deleteOrganizationId: null,
      TableOrganization: {
        id: null,
        name: "",
        comment: "",
      },
      organizations: [],
    };
  },
  mounted() {
    this.fetchOrganizations();
  },
  methods: {
    fetchOrganizations() {
      OrganizationsApi.getOrganizations()
        .then((data) => {
          this.organizations = data;
        })
        .catch((err) => {
          console.error("Error fetching organizations:", err);
          this.organizations = [];
        });
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
    handleSaveOrganization(organization) {
      if (this.isEditMode) {
        this.updateOrganization(organization);
      } else {
        this.addOrganization(organization);
      }
    },
    addOrganization() {
      if (this.TableOrganization.name && this.TableOrganization.comment) {
        OrganizationsApi.addOrganization({
          name: this.TableOrganization.name,
          comment: this.TableOrganization.comment,
        })
          .then(() => {
            this.fetchOrganizations();
            this.dialog = false;
            this.TableOrganization.name = "";
            this.TableOrganization.comment = "";
          })
          .catch((err) => {
            console.error("Error adding organization:", err);
          });
      }
    },
    updateOrganization() {
      OrganizationsApi.updateOrganization(this.TableOrganization.id, {
        name: this.TableOrganization.name,
        comment: this.TableOrganization.comment,
      })
        .then(() => {
          this.fetchOrganizations();
          this.dialog = false;
          this.TableOrganization = { name: "", comment: "" };
        })
        .catch((err) => {
          console.error("Error updating organization:", err);
        });
    },
    openDeleteDialog(id) {
      this.deleteOrganizationId = id;
      this.deleteDialog = true;
    },
    deleteOrganization() {
      if (this.deleteOrganizationId !== null) {
        OrganizationsApi.deleteOrganization(this.deleteOrganizationId)
          .then(() => {
            this.fetchOrganizations();
            this.deleteDialog = false;
            this.deleteOrganizationId = null;
          })
          .catch((err) => {
            console.error("Error deleting organization:", err);
          });
      }
    },
  },
};
</script>

<style scoped>
.v-btn {
  margin-right: 8px;
}
</style>
