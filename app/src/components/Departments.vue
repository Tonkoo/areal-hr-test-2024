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

    <v-table>
      <thead>
        <tr>
          <th>Код</th>
          <th>Отдел</th>
          <th>Родитель</th>
          <th>Комментарий</th>
          <th>Организация</th>
          <th>Действие</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in departments" :key="item.department_id">
          <td>{{ item.department_id }}</td>
          <td>{{ item.department_name }}</td>
          <td>{{ item.parent_department_name }}</td>
          <td>{{ item.department_comment }}</td>
          <td>{{ item.organization_name }}</td>
          <td>
            <v-btn color="blue" @click="openEditDialog(item)" small
              >Изменить</v-btn
            >
            <v-btn
              color="red"
              @click="openDeleteDialog(item.department_id)"
              small
              >Удалить</v-btn
            >
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<script>
import api from "@/api/axios";
import DepartmentForm from "@/modules/departments/components/DepartmentForm.vue";
import DepartmentDeleteDialog from "@/modules/departments/components/DepartmentDeleteDialog.vue";

export default {
  components:{
    DepartmentForm,
    DepartmentDeleteDialog
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
      api
        .get("/departments")
        .then((response) => {
          this.departments = response.data;
        })
        .catch((error) => {
          console.error("Error fetching departments:", error);
        });
    },
    fetchOrganizations() {
      api
        .get("/organizations")
        .then((response) => {
          this.organizations = response.data;
        })
        .catch((error) => {
          console.error("Error fetching organizations:", error);
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
      api
        .delete(`departments/${this.deleteDepartmentId}`)
        .then(() => {
          this.departments = this.departments.filter(
            (dept) => dept.department_id !== this.deleteDepartmentId
          );
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
        const method = this.dialogMode === "add" ? "post" : "put";
        const url =
          this.dialogMode === "add"
            ? "/departments"
            : `departments/${this.TableDepartment.id}`;

        api[method](url, this.TableDepartment)
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
