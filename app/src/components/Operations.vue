<template>
  <v-container
    fluid
    class="d-flex flex-column"
    style="height: 100vh; padding: 0"
  >
    <v-toolbar flat>
      <v-toolbar-title>Кадровые операции</v-toolbar-title>
    </v-toolbar>

    <v-table>
      <thead>
        <tr>
          <th>Код</th>
          <th>Сотрудник</th>
          <th>Тип операции</th>
          <th>Отдел</th>
          <th>Должность</th>
          <th>Зарплата</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in operations" :key="item.operations_id">
          <td>{{ item.operations_id }}</td>
          <td>{{ item.full_name }}</td>
          <td>{{ item.type_operation }}</td>
          <td>{{ item.departments_name }}</td>
          <td>{{ item.positions_name }}</td>
          <td>{{ item.salary }}</td>
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
      operations: [],
    };
  },
  mounted() {
    this.fetchOperations();
  },
  methods: {
    fetchOperations() {
      axios
        .get("http://localhost:3000/api/operations")
        .then((response) => {
          this.operations = response.data;
        })
        .catch((error) => {
          console.error("Error fetching operations:", error);
        });
    },
  },
};
</script>

<style>

</style>
