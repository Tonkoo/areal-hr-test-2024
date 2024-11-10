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
        @click="addOrganization"
        elevation="10"
        class="white--text"
      >
        Добавить
      </v-btn>
    </v-toolbar>

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
            <v-btn color="blue" @click="editOrganization(item)" small
              >Изменить</v-btn
            >
            <v-btn color="red" @click="deleteOrganization(item.id)" small
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
      console.log("Добавить организацию");
    },
    editOrganization(item) {
      console.log("Изменить организацию", item);
    },
    deleteOrganization(id) {
      console.log("Удалить организацию с ID:", id);
      this.organizations = this.organizations.filter((org) => org.id !== id);
    },
  },
};
</script>

<style scoped>
.v-btn {
  margin-right: 8px;
}
</style>
