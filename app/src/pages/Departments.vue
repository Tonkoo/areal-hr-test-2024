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
      :TableDepartment="TableDepartment"
      :organizations="organizations"
      :filtered-departments="filteredDepartments"
      :is-add-mode="dialogMode === 'add'"
      @update:dialog="dialog = $event"
      @save="saveDepartment"
    />

    <DepartmentDeleteDialog
      :deleteDialog="deleteDialog"
      @update:deleteDialog="deleteDialog = $event"
      @delete="deleteDepartment"
    />

    <DepartmentTable
      :departments="departments"
      @edit="openEditDialog"
      @delete="openDeleteDialog"
    />
  </v-container>
</template>

<script>
import DepartmentForm from "@/modules/departments/components/DepartmentForm.vue";
import DepartmentDeleteDialog from "@/modules/departments/components/DepartmentDeleteDialog.vue";
import DepartmentTable from "@/modules/departments/components/DepartmentTable.vue";
import DepartmentApi from "@/modules/departments/api/DepartmentApi";
import OrganizationsApi from "@/modules/organizations/api/OrganizationsApi";

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
      departments: [],
      organizations: [],
    };
  },
  mounted() {
    this.fetchDepartments();
    this.fetchOrganizations();
  },
  computed: {
    filteredDepartments() {
      return this.departments.filter(
        (dept) => dept.department_id !== this.TableDepartment.id
      );
    },
  },
  methods: {
    fetchDepartments() {
      DepartmentApi.getDepartments()
        .then((data) => {
          this.departments = data;
        })
        .catch((err) => {
          console.error("Error fetching departments:", err);
        });
    },
    fetchOrganizations() {
      OrganizationsApi.getOrganizations()
        .then((data) => {
          this.organizations = data;
        })
        .catch((err) => {
          console.error("Error fetching organizations:", err);
        });
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
        parent_id: department.parent_department_name
          ? this.departments.find(
              (d) => d.department_name === department.parent_department_name
            ).department_id
          : null,
        organization_id: this.organizations.find(
          (o) => o.name === department.organization_name
        ).id,
      };
      this.dialog = true;
    },
    openDeleteDialog(id) {
      this.deleteDepartmentId = id;
      this.deleteDialog = true;
    },
    deleteDepartment() {
      DepartmentApi.deleteDepartment(this.deleteDepartmentId)
        .then(() => {
          this.fetchDepartments();
          this.deleteDialog = false;
          this.deleteDepartmentId = null;
        })
        .catch((error) => {
          console.error("Error deleting department:", error);
        });
    },
    getDialogTitle() {
      if (this.dialogMode === "add") {
        return this.isSubDepartmentMode
          ? "Добавить подотдел"
          : "Добавить отдел";
      } else {
        return this.isSubDepartmentMode
          ? "Изменить подотдел"
          : "Изменить отдел";
      }
    },
    saveDepartment() {
      if (
        this.TableDepartment.name &&
        this.TableDepartment.comment &&
        this.TableDepartment.organization_id
      ) {
        const method =
          this.dialogMode === "add" ? "addDepartment" : "updateDepartment";
        const departmentData = this.TableDepartment;

        DepartmentApi[method](
          this.dialogMode === "add" ? departmentData : departmentData.id,
          departmentData
        )
          .then(() => {
            this.dialog = false;
            this.fetchDepartments();
          })
          .catch((error) => {
            console.error("Error saving department:", error);
          });
      } else {
        console.error("Not all data has been entered");
      }
    },
  },
};
</script>

<style>
.v-btn {
  margin-right: 8px;
}
</style>
