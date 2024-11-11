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

    <v-dialog v-model="dialog" max-width="700px">
      <v-card>
        <v-card-title class="headline">
          {{ isSubDepartmentMode ? "Добавить подотдел" : "Добавить отдел" }}
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
              v-if="isSubDepartmentMode"
              v-model="TableDepartment.parent_id"
              :items="departments"
              item-title="department_name"
              item-value="department_id"
              label="Родительский отдел"
              @update:focused="setOrganizationIdFromParent()"
              required
            ></v-select>
            <v-select
              v-if="!isSubDepartmentMode"
              v-model="TableDepartment.organization_id"
              :items="organizations"
              item-title="name"
              item-value="id"
              label="Организация"
              required
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue" text @click="dialog = false">Отмена</v-btn>
          <v-btn
            color="blue"
            text
            @click="isSubDepartmentMode ? addSubDepartment() : addDepartment()"
          >
            {{ isSubDepartmentMode ? "Добавить подотдел" : "Добавить отдел" }}
          </v-btn>
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
        <tr v-for="item in departments" :key="item.id">
          <td>{{ item.department_id }}</td>
          <td>{{ item.department_name }}</td>
          <td>{{ item.parent_department_name }}</td>
          <td>{{ item.department_comment }}</td>
          <td>{{ item.organization_name }}</td>
          <td>
            <v-btn color="blue" @click="" small>Изменить</v-btn>
            <v-btn color="red" @click="" small>Удалить</v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      dialog: false,
      isSubDepartmentMode: false,
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
  methods: {
    fetchDepartments() {
      axios
        .get("http://localhost:3000/api/departments")
        .then((response) => {
          this.departments = response.data;
        })
        .catch((error) => {
          console.error("Error fetching departments:", error);
        });
    },
    fetchOrganizations() {
      axios
        .get("http://localhost:3000/api/organizations")
        .then((response) => {
          this.organizations = response.data;
        })
        .catch((error) => {
          console.error("Error fetching organizations:", error);
        });
    },
    openAddDialog(isSubDepartmentMode) {
      this.isSubDepartmentMode = isSubDepartmentMode;
      this.TableDepartment = {
        name: "",
        comment: "",
        parent_id: null,
        organization_id: null,
      };
      this.dialog = true;
    },
    addDepartment() {
      if (
        this.TableDepartment.name &&
        this.TableDepartment.comment &&
        this.TableDepartment.organization_id
      ) {
        axios
          .post("http://localhost:3000/api/departments", this.TableDepartment)
          .then((response) => {
            this.departments.push(response.data);
            this.dialog = false;
            this.TableDepartment = {
              name: "",
              comment: "",
              parent_id: null,
              organization_id: null,
            };
            this.fetchDepartments();
          })
          .catch((error) => {
            console.error("Error adding department:", error);
          });
      }
    },
    setOrganizationIdFromParent() {
      const parentId = this.TableDepartment.parent_id;
      if (parentId) {
        axios
          .get(
            `http://localhost:3000/api/get-organization-by-parent/${parentId}`
          )
          .then((response) => {
            if (response.data && response.data.organization_id) {
              this.TableDepartment.organization_id =
                response.data.organization_id;
            } else {
              console.error("Organization ID not found in the response.");
            }
          })
          .catch((error) => {
            console.error("Error fetching organization by parent:", error);
          });
      }
    },
    addSubDepartment() {
      if (
        this.TableDepartment.name &&
        this.TableDepartment.comment &&
        this.TableDepartment.parent_id &&
        this.TableDepartment.organization_id
      ) {
        axios
          .post("http://localhost:3000/api/departments", this.TableDepartment)
          .then((response) => {
            this.departments.push(response.data);
            this.dialog = false;
            this.TableDepartment = {
              name: "",
              comment: "",
              parent_id: null,
              organization_id: null,
            };
            this.fetchDepartments();
          })
          .catch((error) => {
            console.error(
              "Error adding sub-department:",
              error.response ? error.response.data : error
            );
          });
      } else {
        console.error("Not all data has been entered for the sub-department");
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
