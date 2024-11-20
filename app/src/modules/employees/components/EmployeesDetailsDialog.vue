<template>
  <v-dialog
    :model-value="detailsDialog"
    @update:model-value="$emit('update:dialog', $event)"
    max-width="500px"
  >
    <v-card>
      <v-card-title class="headline">Подробная информация о сотруднике</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item>
            <v-list-item-title>Отдел</v-list-item-title>
            <v-list-item-subtitle>{{
              TableEmployees.department_name
            }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Должность</v-list-item-title>
            <v-list-item-subtitle>{{
              TableEmployees.position_name
            }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Зарплата</v-list-item-title>
            <v-list-item-subtitle
              >{{ TableEmployees.salary }} руб.</v-list-item-subtitle
            >
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeDialog"
          >Закрыть</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    detailsDialog: {
      type: Boolean,
      required: true,
    },
    TableEmployees: {
      type: Object,
      required: true,
    },
  },
  emits: ["update:detailsDialog"],
  methods: {
    closeDialog() {
      this.$emit("update:detailsDialog", false);
    },
  },
};
</script>
