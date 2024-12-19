<template>
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
      <tr v-for="item in departments" :key="item.department_id">
        <td>{{ item.department_id }}</td>
        <td>{{ item.department_name }}</td>
        <td>{{ item.parent_department_name }}</td>
        <td>{{ item.department_comment }}</td>
        <td>{{ item.organization_name }}</td>
        <td>
          <v-btn color="blue" @click="openEditDialog(item)" small
            >Изменить</v-btn
          >
          <v-btn color="red" @click="openDeleteDialog(item.department_id)" small
            >Удалить</v-btn
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
import DepartmentApi from "../api/department-api";

export default {
  data() {
    return {
      departments: [],
    };
  },
  mounted() {
    this.fetchDepartments();
  },
  methods: {
    fetchDepartments() {
      DepartmentApi.getDepartments()
        .then((data) => {
          this.departments = data;
          this.$emit("updateDepartments", this.departments);
        })
        .catch((err) => {
          this.settingsSnackBar = {
            error: true,
            text: err.status + ": " + err.response.statusText,
          };
          this.$emit("openSnackBar", this.settingsSnackBar);
          this.departments = [];
        });
    },
    openEditDialog(item) {
      this.$emit("edit", item);
    },
    openDeleteDialog(id) {
      this.$emit("delete", id);
    },
    openHistoryDialog(item) {
      this.$emit("history", item);
    },
  },
};
</script>
<style scoped>
.v-btn {
  margin-right: 8px;
}
</style>
