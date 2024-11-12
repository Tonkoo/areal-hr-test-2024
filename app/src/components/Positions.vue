<template>
  <v-container
    fluid
    class="d-flex flex-column"
    style="height: 100vh; padding: 0"
  >
    <v-toolbar flat>
      <v-toolbar-title>Должности</v-toolbar-title>
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
          <th>Должность</th>
          <th>Отдел</th>
          <th>Действие</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in positions" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.position_name }}</td>
          <td>{{ item.department_name }}</td>
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
      positions: [],
    };
  },
  mounted() {
    axios
      .get("http://localhost:3000/api/positions")
      .then((response) => {
        if (Array.isArray(response.data)) {
          this.positions = response.data;
        } else {
          console.error("Expected an array but got:", response.data);
          this.positions = [];
        }
      })
      .catch((error) => {
        console.error("Error fetching positions:", error);
      });
  },
};
</script>

<style></style>
