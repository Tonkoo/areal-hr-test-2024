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

    <!-- <v-dialog v-model="dialog" max-width="700px">
      <v-card>
        <v-card-title class="headline">
          {{ getDialogTitle() }}
        </v-card-title>
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
          <v-btn color="blue" text @click="dialog = false">Отмена</v-btn>
          <v-btn color="blue" text @click="saveDepartment">
            {{ dialogMode === "add" ? "Добавить" : "Сохранить изменения" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->

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

    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Подтверждение удаления</v-card-title>
        <v-card-text>Вы точно хотите удалить данный отдел?</v-card-text>
        <v-card-actions>
          <v-btn color="blue" text @click="deleteDialog = false">Отмена</v-btn>
          <v-btn color="red" text @click="deleteDepartment">Удалить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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

export default {
  components:{
    DepartmentForm
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
