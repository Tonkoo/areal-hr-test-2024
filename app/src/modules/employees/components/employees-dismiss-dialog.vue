<template>
  <v-dialog
    :model-value="dismissDialog"
    @update:model-value="$emit('update:dismissDialog', $event)"
    max-width="500px"
  >
    <v-card>
      <v-card-title class="headline">Уволить сотрудника</v-card-title>
      <v-card-text>
        Вы уверены, что хотите уволить сотрудника
        {{ LocalEmployees.last_name }} {{ LocalEmployees.first_name }}?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeDialog">Отмена</v-btn>
        <v-btn color="red darken-1" text @click="dismissEmployee"
          >Уволить</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import EmployeesApi from "../api/employees-api";
export default {
  props: {
    dismissDialog: {
      type: Boolean,
      required: true,
    },
    TableEmployees: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      LocalEmployees: { ...this.TableEmployees },
    };
  },
  watch: {
    TableEmployees: {
      handler(newEmployee) {
        this.LocalEmployees = { ...newEmployee };
      },
      deep: true,
    },
  },
  emits: ["update:dismissDialog", "dismiss"],
  methods: {
    closeDialog() {
      this.$emit("update:dismissDialog", false);
    },
    dismissEmployee() {
      EmployeesApi.dismissEmployee(this.LocalEmployees.id)
        .then(() => {
          this.closeDialog();
          this.$emit("dismiss");
        })
        .catch((err) => console.error(err));
    },
  },
};
</script>
