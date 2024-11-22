<template>
  <v-container
    fluid
    class="d-flex flex-column"
    style="height: 100vh; padding: 0"
  >
    <v-toolbar flat>
      <v-toolbar-title>Отделы</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        color="deep-purple accent-4"
        @click="openAddDialog(false)"
        elevation="10"
        class="white--text"
      >
        Добавить отдел
      </v-btn>
      <v-btn
        color="deep-purple accent-4"
        @click="openAddDialog(true)"
        elevation="10"
        class="white--text"
      >
        Добавить подотдел
      </v-btn>
    </v-toolbar>

    <DepartmentForm
      :dialog="dialog"
      :is-sub-department-mode="isSubDepartmentMode"
      :departments="departments"
      :dialogMode="dialogMode"
      :TableDepartment="TableDepartment"
      :is-add-mode="dialogMode === 'add'"
      @update:dialog="dialog = $event"
      @save="refreshDepartment"
    />

    <DepartmentDeleteDialog
      :deleteDialog="deleteDialog"
      :deleteDepartmentId="deleteDepartmentId"
      @update:deleteDialog="deleteDialog = $event"
      @delete="refreshDepartment"
    />

    <DepartmentTable
      ref="departmentTable"
      @edit="openEditDialog"
      @delete="openDeleteDialog"
      @updateDepartments="handleUpdateDepartments"
    />
  </v-container>
</template>

<script>
import DepartmentForm from "@/modules/departments/components/DepartmentForm.vue";
import DepartmentDeleteDialog from "@/modules/departments/components/DepartmentDeleteDialog.vue";
import DepartmentTable from "@/modules/departments/components/DepartmentTable.vue";

export default {
  components: {
    DepartmentForm,
    DepartmentDeleteDialog,
    DepartmentTable,
  },
  data() {
    return {
      dialog: false,
      deleteDialog: false,
      isSubDepartmentMode: false,
      dialogMode: "add",
      TableDepartment: {
        id: null,
        name: "",
        comment: "",
        parent_id: null,
        organization_id: null,
      },
      deleteDepartmentId: 0,
      departments: [],
    };
  },
  methods: {
    handleUpdateDepartments(departments) {
      this.departments = departments;
    },
    refreshDepartment() {
      this.$refs.departmentTable.fetchDepartments();
    },
    openAddDialog(isSubDepartmentMode) {
      this.isSubDepartmentMode = isSubDepartmentMode;
      this.dialogMode = "add";
      this.TableDepartment = {
        name: "",
        comment: "",
        parent_id: null,
        organization_id: null,
      };
      this.dialog = true;
    },
    openEditDialog(department) {
      this.dialogMode = "edit";
      this.isSubDepartmentMode = !!department.parent_department_name;
      this.TableDepartment = {
        id: department.department_id,
        name: department.department_name,
        comment: department.department_comment,
        parent_id: department.parent_department_name,
        organization_id: department.organization_name,
      };
      this.dialog = true;
    },
    openDeleteDialog(id) {
      this.deleteDepartmentId = id;
      this.deleteDialog = true;
    },
  },
};
</script>

<style>
.v-btn {
  margin-right: 8px;
}
</style>
