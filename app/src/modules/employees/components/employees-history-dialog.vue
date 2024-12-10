<template>
  <v-dialog
    :model-value="historyDialog"
    @update:model-value="$emit('update:historyDialog', $event)"
    max-width="1000px"
  >
    <v-card>
      <v-card-title class="headline">История записиы</v-card-title>
      <v-table>
        <thead>
          <tr>
            <th>Код</th>
            <th>Дата операции</th>
            <th>Автор</th>
            <th>Старое значение</th>
            <th>Новое значение</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in historyEmployee" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.datetime_operations }}</td>
            <td>{{ item.full_name }}</td>
            <td v-html="formatHistory(item.old_value)"></td>
            <td v-html="formatHistory(item.new_value)"></td>
          </tr>
        </tbody>
      </v-table>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeDialog">Закрыть</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import employeesApi from "../api/employees-api";

export default {
  props: {
    historyDialog: {
      type: Boolean,
      required: true,
    },
    employee: {
      type: Object,
      required: true,
    },
  },
  emits: ["update:historyDialog", "save"],
  data() {
    return {
      localEmployee: { ...this.employee },
      historyEmployee: {},
    };
  },
  watch: {
    historyDialog(newValue) {
      if (newValue) {
        this.fetchHistoryEmployees();
      }
    },
    employee: {
      handler(newEmployee) {
        this.localEmployee = { ...newEmployee };
      },
      deep: true,
    },
  },
  methods: {
    closeDialog() {
      this.$emit("update:historyDialog", false);
    },
    fetchHistoryEmployees() {
      console.log(this.localEmployee.id);

      employeesApi
        .getHistoryEmployees(this.localEmployee.id)
        .then((data) => {
          this.historyEmployee = data;
        })
        .catch((err) => {
          console.error("Error fetching history employees:", err);
          this.historyEmployee = [];
        });
    },
    formatHistory(value) {
      if (!value) return "";
      return value.replace(/\n/g, "<br>");
    },
  },
};
</script>
