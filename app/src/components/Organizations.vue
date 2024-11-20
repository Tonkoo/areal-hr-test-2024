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

    <!-- <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Подтверждение удаления</v-card-title>
        <v-card-text>Вы точно хотите удалить данную организацию?</v-card-text>
        <v-card-actions>
          <v-btn color="blue" text @click="deleteDialog = false">Отмена</v-btn>
          <v-btn color="red" text @click="deleteOrganization()">Удалить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->

    <OrganizationDeleteDialog
      :deleteDialog="deleteDialog"
      @update:deleteDialog="deleteDialog = $event"
      @delete="deleteOrganization"
    />

    <v-table>
      <thead>
        <tr>
          <th>Код</th>
          <th>Организация</th>
          <th>Комментарий</th>
          <th>Действие</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in organizations" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.comment }}</td>
          <td>
            <v-btn color="blue" @click="openEditDialog(item)" small
              >Изменить</v-btn
            >
            <v-btn color="red" @click="openDeleteDialog(item.id)" small
              >Удалить</v-btn
            >
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<script>
import api from "@/api/axios";
import OrganizationForm from "@/modules/organizations/components/OrganizationForm.vue";
import OrganizationDeleteDialog from "@/modules/organizations/components/OrganizationDeleteDialog.vue";

export default {
  components: {
    OrganizationForm,
    OrganizationDeleteDialog,
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
      .catch((error) => {
        console.error("Error fetching organizations:", error);
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
          .catch((error) => {
            console.error("Error saving organization:", error);
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
        .catch((error) => {
          console.error("Error updating organization:", error);
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
          .catch((error) => {
            console.error("Error deleting organization:", error);
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
