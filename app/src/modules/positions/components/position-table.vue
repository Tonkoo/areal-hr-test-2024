<template>
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
          <v-btn color="blue" @click="openEditDialog(item)" small
            >Изменить</v-btn
          >
          <v-btn color="red" @click="openDeleteDialog(item.id)" small
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
import PositionApi from "../api/position-api";
export default {
  data() {
    return {
      positions: [],
    };
  },
  mounted() {
    this.fetchPosition();
  },
  methods: {
    fetchPosition() {
      PositionApi.getPosition()
        .then((data) => {
          this.positions = data;
        })
        .catch((err) => {
          this.settingsSnackBar = {
            error: true,
            text: err.message,
          };
          this.$emit("openSnackBar", this.settingsSnackBar);
          this.positions = [];
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
