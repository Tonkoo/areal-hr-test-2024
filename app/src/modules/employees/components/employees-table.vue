<template>
  <v-table>
    <thead>
      <tr>
        <th>Код</th>
        <th>Фамилия</th>
        <th>Имя</th>
        <th>Отчество</th>
        <th>Отдел</th>
        <th>Должность</th>
        <th>Зарплата</th>
        <th>Статус</th>
        <th>Действие</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in employees" :key="item.id">
        <td>{{ item.id }}</td>
        <td>{{ item.last_name }}</td>
        <td>{{ item.first_name }}</td>
        <td>{{ item.middle_name }}</td>
        <td>{{ item.department_name }}</td>
        <td>{{ item.position_name }}</td>
        <td>{{ item.salary }}</td>
        <td>{{ item.fired ? "Уволен" : "Работает" }}</td>
        <td>
          <v-btn color="blue" @click="openDetailsDialog(item)" small
            >Подробнее</v-btn
          >
          <v-btn
            color="blue"
            @click="openFilesDialog(item)"
            small
            :disabled="item.fired === true"
            >Файлы</v-btn
          >
          <v-btn
            color="blue"
            @click="openEditDialog(item)"
            small
            :disabled="item.fired === true"
            >Изменить</v-btn
          >
          <v-btn
            color="red"
            @click="openDismissDialog(item)"
            small
            :disabled="item.fired === true"
            >Уволить</v-btn
          >
          <v-btn color="blue" @click="openHistoryDialog(item)" small
            >История</v-btn
          >
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script>
import EmployeesApi from "../api/employees-api";
export default {
  data() {
    return {
      employees: [],
    };
  },
  mounted() {
    this.fetchEmployees();
  },
  methods: {
    fetchEmployees() {
      EmployeesApi.getEmployees()
        .then((data) => {
          this.employees = data;
        })
        .catch((err) => console.error(err));
    },
    openEditDialog(item) {
      this.$emit("edit", item);
    },
    openDetailsDialog(item) {
      this.$emit("DetailsDialog", item);
    },
    openFilesDialog(item) {
      this.$emit("FilesDialog", item);
    },
    openDismissDialog(item) {
      this.$emit("dismiss", item);
    },
    openHistoryDialog(item) {
      this.$emit("history", item);
    },
  },
};
</script>
<style scoped>
.v-btn {
  margin: 5px;
  width: 130px;
}
td,
th {
  width: 60px;
}
</style>
