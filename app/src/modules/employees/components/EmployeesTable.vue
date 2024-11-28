<template>
  <v-table>
    <thead>
      <tr>
        <th>Код</th>
        <th>Фамилия</th>
        <th>Имя</th>
        <th>Отчество</th>
        <th>Дата рождения</th>
        <th>Серия паспорта</th>
        <th>Номер паспорта</th>
        <th>Регион</th>
        <th>Город</th>
        <th>Улица</th>
        <th>Дом</th>
        <th>Корпус</th>
        <th>Квартира</th>
        <th>Действие</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in employees" :key="item.id">
        <td>{{ item.id }}</td>
        <td>{{ item.last_name }}</td>
        <td>{{ item.first_name }}</td>
        <td>{{ item.middle_name }}</td>
        <td>{{ item.date_of_birth }}</td>
        <td>{{ item.passport_series }}</td>
        <td>{{ item.passport_number }}</td>
        <td>{{ item.region }}</td>
        <td>{{ item.city }}</td>
        <td>{{ item.street }}</td>
        <td>{{ item.house }}</td>
        <td>{{ item.building }}</td>
        <td>{{ item.apartment }}</td>
        <td>
          <v-btn color="blue" @click="openDetailsDialog(item)" small
            >Подробнее</v-btn
          >
          <v-btn color="blue" @click="openFilesDialog(item)" small>Файлы</v-btn>
          <v-btn color="blue" @click="openEditDialog(item)" small
            >Изменить</v-btn
          >
          <v-btn color="red" @click="openDismissDialog(item)" small
            >Уволить</v-btn
          >
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script>
import EmployeesApi from "../api/EmployeesApi";
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
