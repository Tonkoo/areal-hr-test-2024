<template>
  <v-dialog
    :model-value="dialog"
    @update:model-value="$emit('update:dialog', $event)"
    max-width="700px"
  >
    <v-card>
      <v-card-title class="headline">{{ getDialogTitle }}</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field
            v-model="TableDepartment.name"
            label="Название отдела"
            required
          ></v-text-field>
          <v-textarea
            v-model="TableDepartment.comment"
            label="Комментарий"
            required
          ></v-textarea>
          <v-select
            v-if="isSubDepartmentMode || TableDepartment.parent_id"
            v-model="TableDepartment.parent_id"
            :items="filteredDepartments"
            item-title="department_name"
            item-value="department_id"
            label="Родительский отдел"
            @update:model-value="updateOrganizationId"
            required
          ></v-select>
          <v-select
            v-model="TableDepartment.organization_id"
            :items="organizations"
            item-title="name"
            item-value="id"
            label="Организация"
            :disabled="isSubDepartmentMode || TableDepartment.parent_id"
            required
          ></v-select>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="blue" text @click="closeDialog">Отмена</v-btn>
        <v-btn color="blue" text @click="saveDepartment">
          {{ isAddMode ? "Добавить" : "Сохранить изменения" }}
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
    isSubDepartmentMode: {
      type: Boolean,
      required: true,
    },
    TableDepartment: {
      type: Object,
      required: true,
    },
    departments: {
      type: Array,
      required: true,
    },
    organizations: {
      type: Array,
      required: true,
    },
    filteredDepartments: {
      type: Array,
      required: true,
    },
    isAddMode: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      departmentData: { ...this.TableDepartment },
    };
  },
  emits: ["update:dialog", "save"],
  computed: {
    getDialogTitle() {
      return this.isAddMode
        ? this.isSubDepartmentMode
          ? "Добавить подотдел"
          : "Добавить отдел"
        : this.isSubDepartmentMode
        ? "Изменить подотдел"
        : "Изменить отдел";
    },
  },
  methods: {
    closeDialog() {
      this.$emit("update:dialog", false);
    },
    saveDepartment() {
      this.$emit("save");
    },
    updateOrganizationId() {
      if (this.TableDepartment.parent_id) {
        const parentDepartment = this.departments.find(
          (d) => d.department_id === this.TableDepartment.parent_id
        );
        if (parentDepartment) {
          this.TableDepartment.organization_id = this.organizations.find(
            (o) => o.name === parentDepartment.organization_name
          ).id;
        }
      }
    },
  },
};
</script>
