<template>
  <v-container
    fluid
    class="d-flex flex-column"
    style="height: 100vh; padding: 0"
  >
    <v-toolbar flat>
      <v-toolbar-title>Отделы</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        color="deep-purple accent-4"
        @click=""
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
          <th>Отдел</th>
          <th>Родитель</th>
          <th>Комментарий</th>
          <th>Организация</th>
          <th>Действие</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in departments" :key="item.id">
          <td>{{ item.department_id }}</td>
          <td>{{ item.department_name }}</td>
          <td>{{ item.parent_department_name }}</td>
          <td>{{ item.department_comment }}</td>
          <td>{{ item.organization_name }}</td>
          <td>
            <v-btn color="blue" @click="" small>Изменить</v-btn>
            <v-btn color="red" @click="" small>Удалить</v-btn>
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
      departments: [],
    };
  },
  mounted() {
    axios
      .get("http://localhost:3000/api/departments")
      .then((response) => {
        if (Array.isArray(response.data)) {
          this.departments = response.data;
        } else {
          console.error("Expected an array but got:", response.data);
          this.organizations = [];
        }
      })
      .catch((error) => {
        console.error("Error fetching organizations:", error);
      });
  },
};
</script>

<style>
.v-btn {
  margin-right: 8px;
}
</style>
