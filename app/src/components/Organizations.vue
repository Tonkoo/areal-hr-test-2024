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
    <v-dialog v-model="dialog" max-width="700px">
      <v-card>
        <v-card-title class="headline">{{
          isEditMode ? "Изменить организацию" : "Добавить организацию"
        }}</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="TableOrganization.name"
              label="Название организации"
              required
            ></v-text-field>
            <v-textarea
              v-model="TableOrganization.comment"
              label="Комментарий"
              required
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue" text @click="dialog = false">Отмена</v-btn>
          <v-btn
            color="blue"
            text
            @click="isEditMode ? updateOrganization() : addOrganization()"
          >
            {{ isEditMode ? "Сохранить" : "Добавить" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Подтверждение удаления</v-card-title>
        <v-card-text>Вы точно хотите удалить данную организацию?</v-card-text>
        <v-card-actions>
          <v-btn color="blue" text @click="deleteDialog = false">Отмена</v-btn>
          <v-btn color="red" text @click="deleteOrganization()">Удалить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
import axios from "axios";

export default {
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
    axios
      .get("http://localhost:3000/api/organizations")
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
    addOrganization() {
      if (this.TableOrganization.name && this.TableOrganization.comment) {
        axios
          .post("http://localhost:3000/api/organizations", {
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
      axios
        .put(
          `http://localhost:3000/api/organizations/${this.TableOrganization.id}`,
          {
            name: this.TableOrganization.name,
            comment: this.TableOrganization.comment,
          }
        )
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
          console.error("Ошибка при обновлении организации:", error);
        });
    },
    openDeleteDialog(id) {
      this.deleteOrganizationId = id;
      this.deleteDialog = true;
    },
    deleteOrganization() {
      if (this.deleteOrganizationId !== null) {
        axios
          .delete(`http://localhost:3000/api/organizations/${this.deleteOrganizationId}`)
          .then(() => {
            this.organizations = this.organizations.filter(
              (org) => org.id !== this.deleteOrganizationId
            );
            this.deleteDialog = false;
            this.deleteOrganizationId = null;
          })
          .catch((error) => {
            console.error("Ошибка при удалении организации:", error);
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
