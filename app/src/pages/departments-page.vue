<template>
  <v-container fluid class="d-flex flex-column" style="padding: 0">
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
      @openSnackBar="openSnackBar"
    />

    <DepartmentDeleteDialog
      :deleteDialog="deleteDialog"
      :deleteDepartmentId="deleteDepartmentId"
      @update:deleteDialog="deleteDialog = $event"
      @delete="refreshDepartment"
      @openSnackBar="openSnackBar"
    />

    <historyDialog
      :historyDialog="historyDialog"
      :history="historyDepartment"
      @update:historyDialog="historyDialog = $event"
    />

    <DepartmentTable
      ref="departmentTable"
      @edit="openEditDialog"
      @delete="openDeleteDialog"
      @updateDepartments="handleUpdateDepartments"
      @history="fetchHistoryDepartments"
      @openSnackBar="openSnackBar"
    />

    <snackBar
      :snackbar="snackbar"
      @update:snackbar="snackbar = $event"
      :settingsSnackBar="localSettingsSnackBar"
    />
  </v-container>
</template>

<script>
import departmentApi from "@/modules/departments/api/department-api";
import DepartmentForm from "@/modules/departments/components/department-form.vue";
import DepartmentDeleteDialog from "@/modules/departments/components/department-delete-dialog.vue";
import DepartmentTable from "@/modules/departments/components/department-table.vue";
import historyDialog from "@/shared/components/history-dialog.vue";
import snackBar from "@/shared/components/snack-bar.vue";

export default {
  components: {
    DepartmentForm,
    DepartmentDeleteDialog,
    DepartmentTable,
    historyDialog,
    snackBar,
  },
  data() {
    return {
      dialog: false,
      deleteDialog: false,
      historyDialog: false,
      isSubDepartmentMode: false,
      snackbar: false,
      localSettingsSnackBar: {
        error: false,
        text: null,
      },
      TableDepartment: {
        department_id: null,
        department_name: "",
        department_comment: "",
        parent_id: null,
        organization_id: null,
      },
      deleteDepartmentId: 0,
      departments: [],
      historyDepartment: [],
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
        department_name: "",
        department_comment: "",
        parent_id: null,
        organization_id: null,
      };
      this.dialog = true;
    },
    openEditDialog(department) {
      this.isAddMode = false;
      this.isSubDepartmentMode = !!department.parent_department_name;
      this.TableDepartment = { ...department };
      this.dialog = true;
    },
    openDeleteDialog(id) {
      this.deleteDepartmentId = id;
      this.deleteDialog = true;
    },
    fetchHistoryDepartments(item) {
      departmentApi
        .getHistoryDepartments(item.department_id)
        .then((data) => {
          this.historyDepartment = data;
          this.historyDialog = true;
        })
        .catch((err) => {
          this.settingsSnackBar = {
            error: true,
            text: err.message,
          };
          this.openSnackBar(this.settingsSnackBar);
          this.historyDepartment = [];
        });
    },
    openSnackBar(settingsSnackBar) {
      this.localSettingsSnackBar = settingsSnackBar;
      this.snackbar = true;
    },
  },
};
</script>

<style scoped>
.v-btn {
  margin-right: 8px;
}
</style>
