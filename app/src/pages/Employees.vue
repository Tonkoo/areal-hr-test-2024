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
      :dismissDialog="dismissDialog"
      :TableEmployees="TableEmployees"
      @update:dismissDialog="dismissDialog = $event"
      @dismiss="dismissEmployee"
    />

    <EmployeesFilesDialog
      :filesDialog="filesDialog"
      :TableEmployees="TableEmployees"
      @update:filesDialog="filesDialog = $event"
    />

    <EmployeesTable
      :employees="employees"
      @edit="openEditDialog"
      @dismiss="openDismissDialog"
      @DetailsDialog="openDetailsDialog"
      @FilesDialog="openFilesDialog"
    />
  </v-container>
</template>

<script>
import EmployeesForm from "@/modules/employees/components/EmployeesForm.vue";
import EmployeesDetailsDialog from "@/modules/employees/components/EmployeesDetailsDialog.vue";
import EmployeesDismissDialog from "@/modules/employees/components/EmployeesDismissDialog.vue";
import EmployeesFilesDialog from "@/modules/employees/components/EmployeesFilesDialog.vue";
import EmployeesTable from "@/modules/employees/components/EmployeesTable.vue";
import EmployeesApi from "@/modules/employees/api/EmployeesApi";
import DepartmentApi from "@/modules/departments/api/DepartmentApi";
import PositionApi from "@/modules/positions/api/PositionApi";

export default {
  components: {
    EmployeesForm,
    EmployeesDetailsDialog,
    EmployeesDismissDialog,
    EmployeesFilesDialog,
    EmployeesTable,
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
      EmployeesApi.getEmployees()
        .then((data) => {
          this.employees = data;
        })
        .catch((err) => console.error(err));
    },
    fetchRegions() {
      EmployeesApi.getRegions()
        .then((data) => {
          this.regions = data;
        })
        .catch((err) => console.error(err));
    },
    fetchCitys() {
      EmployeesApi.getCities()
        .then((data) => {
          this.citys = data;
          this.citiesLoaded = true;
        })
        .catch((err) => console.error(err));
    },
    fetchDepartments() {
      DepartmentApi.getDepartments()
        .then((data) => {
          this.departments = data;
        })
        .catch((err) => console.error(err));
    },
    fetchPositions() {
      PositionApi.getPosition()
        .then((data) => {
          this.positions = data;
          this.positionsLoaded = true;
        })
        .catch((err) => console.error(err));
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
    handleSaveOrganization(employee) {
      if (this.isEditMode) {
        this.updateEmployees(employee);
      } else {
        this.addEmployees(employee);
      }
    },
    addEmployees() {
      const employeeData = { ...this.TableEmployees };
      EmployeesApi.addEmployee(employeeData)
        .then(() => {
          this.fetchEmployees();
          this.dialog = false;
        })
        .catch((err) => console.error(err));
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
      EmployeesApi.updateEmployee(this.TableEmployees.id, {
        ...this.TableEmployees,
      })
        .then(() => {
          this.dialog = false;
          this.fetchEmployees();
        })
        .catch((err) => console.error(err));
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
      EmployeesApi.dismissEmployee(this.TableEmployees.id)
        .then(() => {
          this.dismissDialog = false;
          this.fetchEmployees();
        })
        .catch((err) => console.error(err));
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
