<template>
  <v-dialog :model-value="deleteDialog" @update:model-value="$emit('update:deleteDialog', $event)" max-width="500px">
    <v-card>
      <v-card-title class="headline">Подтверждение удаления</v-card-title>
      <v-card-text>Вы точно хотите удалить данный отдел?</v-card-text>
      <v-card-actions>
        <v-btn color="blue" text @click="closeDialog">Отмена</v-btn>
        <v-btn color="red" text @click="deleteDepartment">Удалить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    deleteDialog: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["update:deleteDialog", "delete"],
  methods: {
    closeDialog() {
      this.$emit("update:deleteDialog", false);
    },
    deleteDepartment() {
      this.$emit("delete");
      this.closeDialog();
    },
  },
};
</script>
