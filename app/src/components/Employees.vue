<template>
  <v-container
    fluid
    class="d-flex flex-column"
    style="height: 100vh; padding: 0"
  >
    <v-toolbar flat>
      <v-toolbar-title>Сотрудники</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        color="deep-purple accent-4"
        @click="openAddDialog()"
        elevation="10"
        class="white--text"
      >
        Добавить сотрудника
      </v-btn>
    </v-toolbar>

    <EmployeesForm
      :dialog="dialog"
      :isEditMode="isEditMode"
      :TableEmployees="TableEmployees"
      :maxDate="maxDate"
      :regions="regions"
      :citiesLoaded="citiesLoaded"
      :filteredCities="filteredCities"
      :departments="departments"
      :filteredPositions="filteredPositions"
      :positionsLoaded="positionsLoaded"
      @save="handleSaveOrganization"
      @update:dialog="dialog = $event"
      />

    <EmployeesDetailsDialog
    :detailsDialog="detailsDialog"
    :TableEmployees="TableEmployees"
    @update:detailsDialog="detailsDialog = $event"
    />

    <EmployeesDismissDialog
      :dismissDialog = "dismissDialog"
      :TableEmployees = "TableEmployees"
      @update:dismissDialog="dismissDialog = $event"
      @dismiss = "dismissEmployee"
    />

    <EmployeesFilesDialog
      :filesDialog="filesDialog"
      :TableEmployees = "TableEmployees"
      @update:filesDialog="filesDialog = $event"
    />

    <v-table>
      <thead>
        <tr>
          <th>Код</th>
          <th>Фамилия</th>
          <th>Имя</th>
          <th>Отчество</th>
          <th>Дата рождения</th>
          <th>Серия паспорта</th>
          <th>Номер паспорта</th>
          <th>Регион</th>
          <th>Город</th>
          <th>Улица</th>
          <th>Дом</th>
          <th>Корпус</th>
          <th>Квартира</th>
          <th>Статус</th>
          <th>Действие</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in employees" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.last_name }}</td>
          <td>{{ item.first_name }}</td>
          <td>{{ item.middle_name }}</td>
          <td>{{ item.date_of_birth }}</td>
          <td>{{ item.passport_series }}</td>
          <td>{{ item.passport_number }}</td>
          <td>{{ item.region }}</td>
          <td>{{ item.city }}</td>
          <td>{{ item.street }}</td>
          <td>{{ item.house }}</td>
          <td>{{ item.building }}</td>
          <td>{{ item.apartment }}</td>
          <td>{{ item.type_operation_id === 2 ? "Уволен" : "Работает" }}</td>
          <td>
            <v-btn color="blue" @click="openDetailsDialog(item)" small
              >Подробнее</v-btn
            >
            <v-btn
              color="blue"
              @click="openFilesDialog(item)"
              small
              :disabled="item.type_operation_id === 2"
              >Файлы</v-btn
            >
            <v-btn
              color="blue"
              @click="openEditDialog(item)"
              small
              :disabled="item.type_operation_id === 2"
              >Изменить</v-btn
            >
            <v-btn
              color="red"
              @click="openDismissDialog(item)"
              small
              :disabled="item.type_operation_id === 2"
              >Уволить</v-btn
            >
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<script>
import api from "@/api/axios";
import EmployeesForm from "@/modules/employees/components/EmployeesForm.vue";
import EmployeesDetailsDialog from "@/modules/employees/components/EmployeesDetailsDialog.vue";
import EmployeesDismissDialog from "@/modules/employees/components/EmployeesDismissDialog.vue";
import EmployeesFilesDialog from "@/modules/employees/components/EmployeesFilesDialog.vue";

export default {
  components:{
    EmployeesForm,
    EmployeesDetailsDialog,
    EmployeesDismissDialog,
    EmployeesFilesDialog
  },
  data() {
    return {
      dialog: false,
      isEditMode: false,
      detailsDialog: false,
      dismissDialog: false,
      filesDialog: false,
      TableEmployees: {
        id: null,
        last_name: "",
        first_name: "",
        middle_name: "",
        date_of_birth: null,
        passport_series: "",
        passport_number: "",
        region_id: null,
        city_id: null,
        street: "",
        house: "",
        building: "",
        apartment: null,
        department_name: "",
        position_name: "",
        department_id: null,
        position_id: null,
        salary: 0,
      },
      employees: [],
      regions: [],
      citys: [],
      departments: [],
      positions: [],
      maxDate: new Date().toISOString().split("T")[0],
      citiesLoaded: false,
      positionsLoaded: false,
    };
  },
  computed: {
    filteredCities() {
      if (!this.TableEmployees.region_id) return [];
      return this.citys.filter(
        (city) => city.region_id === this.TableEmployees.region_id
      );
    },
    filteredPositions() {
      if (!this.TableEmployees.department_id) return [];
      return this.positions.filter(
        (positions) =>
          positions.department_id === this.TableEmployees.department_id
      );
    },
  },
  mounted() {
    this.fetchEmployees();
    this.fetchRegions();
    this.fetchCitys();
    this.fetchDepartments();
    this.fetchPositions();
  },
  methods: {
    fetchEmployees() {
      api
        .get("/employees")
        .then((response) => {
          this.employees = response.data;
        })
        .catch((error) => {
          console.error("Error retrieving employees:", error);
        });
    },
    fetchRegions() {
      api
        .get("/regions")
        .then((response) => {
          this.regions = response.data;
        })
        .catch((error) => {
          console.error("Error retrieving regions:", error);
        });
    },
    fetchCitys() {
      api
        .get("/citys")
        .then((response) => {
          this.citys = response.data;
          this.citiesLoaded = true;
        })
        .catch((error) => {
          console.error("Error retrieving cities:", error);
        });
    },
    fetchDepartments() {
      api
        .get("/departments")
        .then((response) => {
          this.departments = response.data;
        })
        .catch((error) => {
          console.error("Error retrieving departments:", error);
        });
    },
    fetchPositions() {
      api
        .get("/positions")
        .then((response) => {
          this.positions = response.data;
          this.positionsLoaded = true;
        })
        .catch((error) => {
          console.error("Error retrieving positions:", error);
        });
    },
    openAddDialog() {
      this.isEditMode = false;
      this.TableEmployees = {
        last_name: "",
        first_name: "",
        middle_name: "",
        date_of_birth: null,
        passport_series: "",
        passport_number: "",
        region_id: null,
        city_id: null,
        street: "",
        house: "",
        building: "",
        apartment: null,
        department_name: "",
        position_name: "",
        department_id: null,
        position_id: null,
        salary: 0,
      };
      this.dialog = true;
    },
    handleSaveOrganization(employee){
      if (this.isEditMode) {
        this.updateEmployees(employee);
      } else {
        this.addEmployees(employee);
      }
    },
    addEmployees() {
      api
        .post("/employees", {
          last_name: this.TableEmployees.last_name,
          first_name: this.TableEmployees.first_name,
          middle_name: this.TableEmployees.middle_name,
          date_of_birth: this.TableEmployees.date_of_birth,
          passport_series: this.TableEmployees.passport_series,
          passport_number: this.TableEmployees.passport_number,
          region_id: this.TableEmployees.region_id,
          city_id: this.TableEmployees.city_id,
          street: this.TableEmployees.street,
          house: this.TableEmployees.house,
          building: this.TableEmployees.building,
          apartment: this.TableEmployees.apartment,
          department_id: this.TableEmployees.department_id,
          position_id: this.TableEmployees.position_id,
          salary: this.TableEmployees.salary,
        })
        .then((response) => {
          this.employees.push(response.data);
          this.dialog = false;
          this.fetchEmployees();
        })
        .catch((error) => {
          console.error("Error adding employee:", error);
        });
    },
    openEditDialog(item) {
      this.isEditMode = true;
      this.TableEmployees = {
        id: item.id,
        last_name: item.last_name,
        first_name: item.first_name,
        middle_name: item.middle_name,
        date_of_birth: new Date(item.date_of_birth),
        passport_series: item.passport_series,
        passport_number: item.passport_number,
        passport_series: item.passport_series,
        region_id: this.regions.find((r) => r.name === item.region)?.id,
        city_id: this.citys.find((c) => c.name === item.city)?.id,
        street: item.street,
        house: item.house,
        building: item.building,
        apartment: item.apartment,
        department_id: this.departments.find(
          (d) => d.department_name === item.department_name
        )?.department_id,
        position_id: this.positions.find(
          (p) => p.position_name === item.position_name
        )?.id,
        salary: parseFloat(item.salary.replace(/[$,]/g, "")),
      };

      this.dialog = true;
    },
    updateEmployees() {
      api
        .put(`/employees/${this.TableEmployees.id}`, {
          last_name: this.TableEmployees.last_name,
          first_name: this.TableEmployees.first_name,
          middle_name: this.TableEmployees.middle_name,
          date_of_birth: this.TableEmployees.date_of_birth,
          passport_series: this.TableEmployees.passport_series,
          passport_number: this.TableEmployees.passport_number,
          region_id: this.TableEmployees.region_id,
          city_id: this.TableEmployees.city_id,
          street: this.TableEmployees.street,
          house: this.TableEmployees.house,
          building: this.TableEmployees.building,
          apartment: this.TableEmployees.apartment,
          department_id: this.TableEmployees.department_id,
          position_id: this.TableEmployees.position_id,
          salary: this.TableEmployees.salary,
        })
        .then(() => {
          this.dialog = false;
          this.fetchEmployees();
        })
        .catch((error) => {
          console.error("Error updating employee:", error);
        });
    },
    openDetailsDialog(item) {
      this.TableEmployees = {
        department_name: item.department_name,
        position_name: item.position_name,
        salary: item.salary,
      };
      this.detailsDialog = true;
    },
    openDismissDialog(item) {
      this.TableEmployees = item;
      this.dismissDialog = true;
    },
    dismissEmployee() {
      api
        .post(`/employees/${this.TableEmployees.id}`)
        .then(() => {
          this.dismissDialog = false;
          this.fetchEmployees();
        })
        .catch((error) => {
          console.log(this.TableEmployees.id);

          console.error("Error dismissing employee:", error);
        });
    },
    openFilesDialog(item) {
      this.TableEmployees = item;
      this.filesDialog = true;
    },
  },
};
</script>

<style>
.v-btn {
  margin: 5px;
}
</style>
