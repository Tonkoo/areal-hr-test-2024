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
import api from "@/api/axios";
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
    api
      .get("/organizations")
      .then((response) => {
        if (Array.isArray(response.data)) {
          this.organizations = response.data;
        } else {
          console.error("Expected an array but got:", response.data);
          this.organizations = [];
        }
      })
      .catch((err) => {
        console.error("Error fetching organizations:", err);
      });
  },
  methods: {
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
        api
          .post("/organizations", {
            name: this.TableOrganization.name,
            comment: this.TableOrganization.comment,
          })
          .then((response) => {
            if (response.data) {
              const newOrg = {
                id: response.data.id,
                name: this.TableOrganization.name,
                comment: this.TableOrganization.comment,
              };

              this.organizations.push(newOrg);
              this.dialog = false;
              this.TableOrganization.name = "";
              this.TableOrganization.comment = "";
            }
          })
          .catch((err) => {
            console.error("Error saving organization:", err);
          });
      }
    },
    updateOrganization() {
      api
        .put(`organizations/${this.TableOrganization.id}`, {
          name: this.TableOrganization.name,
          comment: this.TableOrganization.comment,
        })
        .then(() => {
          const index = this.organizations.findIndex(
            (org) => org.id === this.TableOrganization.id
          );
          if (index !== -1) {
            this.organizations[index] = { ...this.TableOrganization };
          }
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
        api
          .delete(`organizations/${this.deleteOrganizationId}`)
          .then(() => {
            this.organizations = this.organizations.filter(
              (org) => org.id !== this.deleteOrganizationId
            );
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
