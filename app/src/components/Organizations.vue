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
        @click="dialog = true"
        elevation="10"
        class="white--text"
      >
        Добавить
      </v-btn>
    </v-toolbar>
    <v-dialog v-model="dialog" max-width="700px">
      <v-card>
        <v-card-title class="headline">Добавить организацию</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="formValid">
            <v-text-field
              v-model="newOrganization.name"
              label="Название организации"
              required
            ></v-text-field>

            <v-textarea
              v-model="newOrganization.comment"
              label="Комментарий"
              required
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue" text @click="dialog = false">Отмена</v-btn>
          <v-btn color="blue" text @click="addOrganization" :disabled="!formValid">Добавить</v-btn>
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
            <v-btn color="blue" @click="editOrganization(item)" small>Изменить</v-btn>
            <v-btn color="red" @click="deleteOrganization(item.id)" small>Удалить</v-btn>
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
      formValid: false,
      newOrganization: {
        name: '',
        comment: '',
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
    addOrganization() {
      if (this.newOrganization.name && this.newOrganization.comment) {
        axios
          .post("http://localhost:3000/api/organizations", {
            name: this.newOrganization.name,
            comment: this.newOrganization.comment,
          })
          .then((response) => {
            if (response.data) {
              const newOrg = {
                id: response.data.id,
                name: this.newOrganization.name,
                comment: this.newOrganization.comment,
              };

              this.organizations.push(newOrg);
              this.dialog = false;
              this.newOrganization.name = '';
              this.newOrganization.comment = '';
            }
          })
          .catch((error) => {
            console.error("Error saving organization:", error);
          });
      }
    },
    editOrganization(item) {
      console.log("Изменить организацию", item);
    },
    deleteOrganization(id) {
      console.log("Удалить организацию с ID:", id);
    },
  },
};
</script>

<style scoped>
.v-btn {
  margin-right: 8px;
}
</style>
