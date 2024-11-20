<template>
  <v-dialog
    :model-value="dialog"
    @update:model-value="$emit('update:dialog', $event)"
    max-width="700px"
  >
    <v-card>
      <v-card-title class="headline">{{
        isEditMode ? "Изменить должность" : "Добавить должность"
      }}</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field
            v-model="TablePosition.position_name"
            label="Название должности"
            required
          ></v-text-field>
          <v-select
            v-model="TablePosition.department_id"
            :items="departments"
            item-title="department_name"
            item-value="department_id"
            label="Отдел"
            required
          ></v-select>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="blue" text @click="closeDialog">Отмена</v-btn>
        <v-btn color="blue" text @click="savePosition">
          {{ isEditMode ? "Сохранить" : "Добавить" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
    isEditMode: {
      type: Boolean,
      required: true,
    },
    TablePosition: {
      type: Object,
      required: true,
    },
    departments: {
      type: Array,
      required: true,
    },
  },
  emits: ["update:dialog", "save"],
  methods: {
    closeDialog() {
      this.$emit("update:dialog", false);
    },
    savePosition() {
      this.$emit("save", this.TablePosition);
      this.closeDialog();
    },
  },
};
</script>
