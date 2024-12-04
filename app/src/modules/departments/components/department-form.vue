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
            v-model="localDepartments.name"
            label="Название отдела"
            :error-messages="errors.name"
            required
          ></v-text-field>
          <v-textarea
            v-model="localDepartments.comment"
            label="Комментарий"
            :error-messages="errors.comment"
            required
          ></v-textarea>
          <v-select
            v-if="isSubDepartmentMode || TableDepartment.parent_id"
            v-model="localDepartments.parent_id"
            :items="filteredDepartments"
            item-title="department_name"
            item-value="department_id"
            label="Родительский отдел"
            @update:model-value="updateOrganizationId"
            :error-messages="errors.parent_id"
            required
          ></v-select>
          <v-select
            v-model="localDepartments.organization_id"
            :items="organizations"
            item-title="name"
            item-value="id"
            label="Организация"
            :disabled="isSubDepartmentMode || TableDepartment.parent_id"
            :error-messages="errors.organization_id"
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
import DepartmentApi from "../api/department-api";
import OrganizationsApi from "@/modules/organizations/api/organizations-api";
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
    isAddMode: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      localDepartments: { ...this.TableDepartment },
      organizations: [],
      errors: {},
    };
  },
  watch: {
    TableDepartment: {
      handler(newDepartment) {
        this.localDepartments = { ...newDepartment };
      },
      deep: true,
    },
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
    filteredDepartments() {
      return this.departments.filter(
        (dept) => dept.department_id !== this.TableDepartment.id
      );
    },
  },
  mounted() {
    this.fetchOrganizations();
  },
  methods: {
    fetchOrganizations() {
      OrganizationsApi.getOrganizations()
        .then((data) => {
          this.organizations = data;
        })
        .catch((err) => {
          console.error("Error fetching organizations:", err);
        });
    },
    closeDialog() {
      this.$emit("update:dialog", false);
      this.errors = [];
    },
    saveDepartment() {
      if (this.isAddMode) {
        this.addDepartment();
      } else {
        this.updateDepartment();
      }
    },
    addDepartment() {
      if (this.isSubDepartmentMode == false) {
        delete this.localDepartments.parent_id;
        DepartmentApi.addDepartment({
          name: this.localDepartments.name,
          comment: this.localDepartments.comment,
          organization_id: this.localDepartments.organization_id,
        })
          .then(() => {
            this.errors = [];
            this.$emit("update:dialog", false);
            this.$emit("save");
          })
          .catch((err) => {
            console.log(this.localDepartments);
            this.errors = err;
            console.error("Error adding department:", err);
          });
      } else {
        DepartmentApi.addDepartment({
          name: this.localDepartments.name,
          comment: this.localDepartments.comment,
          parent_id: this.localDepartments.parent_id,
          organization_id: this.localDepartments.organization_id,
        })
          .then(() => {
            this.errors = [];
            this.$emit("update:dialog", false);
            this.$emit("save");
          })
          .catch((err) => {
            this.errors = err;
            console.error("Error adding department:", err);
          });
      }
    },
    updateDepartment() {
      if (this.isSubDepartmentMode == false) {
        delete this.localDepartments.parent_id;
        DepartmentApi.updateDepartment(this.localDepartments.id, {
          name: this.localDepartments.name,
          comment: this.localDepartments.comment,
          organization_id: this.localDepartments.organization_id,
        })
          .then(() => {
            this.errors = [];
            this.$emit("update:dialog", false);
            this.$emit("save");
          })
          .catch((err) => {
            this.errors = err;
            console.error("Error updating department:", err);
          });
      } else {
        DepartmentApi.updateDepartment(this.localDepartments.id, {
          name: this.localDepartments.name,
          comment: this.localDepartments.comment,
          parent_id: this.localDepartments.parent_id,
          organization_id: this.localDepartments.organization_id,
        })
          .then(() => {
            this.errors = [];
            this.$emit("update:dialog", false);
            this.$emit("save");
          })
          .catch((err) => {
            this.errors = err;
            console.error("Error updating department:", err);
          });
      }
    },
    updateOrganizationId() {
      if (this.localDepartments.parent_id) {
        const parentDepartment = this.departments.find(
          (d) => d.department_id === this.localDepartments.parent_id
        );
        if (parentDepartment) {
          this.localDepartments.organization_id = this.organizations.find(
            (o) => o.name === parentDepartment.organization_name
          ).id;
        }
      }
    },
  },
};
</script>
