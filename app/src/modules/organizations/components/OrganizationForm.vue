<template>
  <v-dialog
    :model-value="dialog"
    @update:model-value="$emit('update:dialog', $event)"
    max-width="700px"
  >
    <v-card>
      <v-card-title class="headline">
        {{ isEditMode ? "Изменить организацию" : "Добавить организацию" }}
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field
            v-model="organization.name"
            label="Название организации"
            required
          ></v-text-field>
          <v-textarea
            v-model="organization.comment"
            label="Комментарий"
            required
          ></v-textarea>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="blue" text @click="closeDialog">Отмена</v-btn>
        <v-btn color="blue" text @click="saveOrganization">
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
    organization: {
      type: Object,
      required: true,
    },
  },
  emits: ["update:dialog", "save"],
  methods: {
    closeDialog() {
      this.$emit("update:dialog", false);
    },
    saveOrganization() {
      this.$emit("save", this.organization);
      this.closeDialog();
    },
  },
};
</script>
