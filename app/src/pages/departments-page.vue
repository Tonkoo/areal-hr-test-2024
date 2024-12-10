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
      :isAddMode="isAddMode"
      :is-sub-department-mode="isSubDepartmentMode"
      :departments="departments"
      :TableDepartment="TableDepartment"
      @update:dialog="dialog = $event"
      @save="refreshDepartment"
    />

    <DepartmentDeleteDialog
      :deleteDialog="deleteDialog"
      :deleteDepartmentId="deleteDepartmentId"
      @update:deleteDialog="deleteDialog = $event"
      @delete="refreshDepartment"
    />

    <DepartmentHistoryDialog
      :historyDialog="historyDialog"
      :department="TableDepartment"
      @update:historyDialog="historyDialog = $event"
    />

    <DepartmentTable
      ref="departmentTable"
      @edit="openEditDialog"
      @delete="openDeleteDialog"
      @updateDepartments="handleUpdateDepartments"
      @history="openHistoryDialog"
    />
  </v-container>
</template>

<script>
import DepartmentForm from "@/modules/departments/components/department-form.vue";
import DepartmentDeleteDialog from "@/modules/departments/components/department-delete-dialog.vue";
import DepartmentTable from "@/modules/departments/components/department-table.vue";
import DepartmentHistoryDialog from "@/modules/departments/components/department-history-dialog.vue";

export default {
  components: {
    DepartmentForm,
    DepartmentDeleteDialog,
    DepartmentTable,
    DepartmentHistoryDialog,
  },
  data() {
    return {
      dialog: false,
      deleteDialog: false,
      historyDialog: false,
      isSubDepartmentMode: false,
      TableDepartment: {
        id: null,
        name: "",
        comment: "",
        parent_id: null,
        organization_id: null,
      },
      deleteDepartmentId: 0,
      departments: [],
      isAddMode: false,
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
      this.isAddMode = true;
      this.isSubDepartmentMode = isSubDepartmentMode;
      this.TableDepartment = {
        name: "",
        comment: "",
        parent_id: null,
        organization_id: null,
      };
      this.dialog = true;
    },
    openEditDialog(department) {
      this.isAddMode = false;
      this.isSubDepartmentMode = !!department.parent_department_name;
      this.TableDepartment = {
        id: department.department_id,
        name: department.department_name,
        comment: department.department_comment,
        parent_id: department.parent_id,
        organization_id: department.organization_id,
      };
      this.dialog = true;
    },
    openDeleteDialog(id) {
      this.deleteDepartmentId = id;
      this.deleteDialog = true;
    },
    openHistoryDialog(item) {
      this.TableDepartment = item;
      this.historyDialog = true;
    },
  },
};
</script>

<style></style>
