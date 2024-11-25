<template>
  <v-dialog
    :model-value="dialog"
    @update:model-value="$emit('update:dialog', $event)"
    max-width="700px"
  >
    <v-card>
      <v-card-title class="headline">{{
        isEditMode ? "Изменить данные сотрудника" : "Добавить сотрудника"
      }}</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field
            v-model="LocalEmployees.last_name"
            label="Фамилия"
            required
          ></v-text-field>
          <v-text-field
            v-model="LocalEmployees.first_name"
            label="Имя"
            required
          ></v-text-field>
          <v-text-field
            v-model="LocalEmployees.middle_name"
            label="Отчество"
            required
          ></v-text-field>
          <v-date-picker
            v-model="LocalEmployees.date_of_birth"
            title="Дата рождения"
            locale="ru-RU"
            :max="maxDate"
            @update:model-value="formatDate"
          ></v-date-picker>
          <v-text-field
            v-model="LocalEmployees.passport_series"
            label="Серия паспорта"
            required
          ></v-text-field>
          <v-text-field
            v-model="LocalEmployees.passport_number"
            label="Номер паспорта"
            required
          ></v-text-field>
          <v-select
            v-model="LocalEmployees.region_id"
            :items="regions"
            item-title="name"
            item-value="id"
            label="Регион"
            required
            @update:model-value="onRegionChange"
          ></v-select>
          <v-select
            v-if="citiesLoaded"
            v-model="LocalEmployees.city_id"
            :items="filteredCities"
            item-title="name"
            item-value="id"
            label="Город"
            required
            :disabled="!LocalEmployees.region_id"
          ></v-select>
          <v-text-field
            v-model="LocalEmployees.street"
            label="Улица"
            required
          ></v-text-field>
          <v-text-field
            v-model="LocalEmployees.house"
            label="Дом"
            required
          ></v-text-field>
          <v-text-field
            v-model="LocalEmployees.building"
            label="Корпус"
            required
          ></v-text-field>
          <v-text-field
            v-model="LocalEmployees.apartment"
            type="number"
            label="Квартира"
            required
          ></v-text-field>
          <v-select
            v-model="LocalEmployees.department_id"
            :items="departments"
            item-title="department_name"
            item-value="department_id"
            label="Отдел"
            required
            @update:model-value="onDepartmentsChange"
          ></v-select>
          <v-select
            v-if="positionsLoaded"
            v-model="LocalEmployees.position_id"
            :items="filteredPositions"
            item-title="position_name"
            item-value="id"
            label="Должность"
            required
            :disabled="!LocalEmployees.department_id"
          ></v-select>
          <v-text-field
            v-model="LocalEmployees.salary"
            label="Зарплата"
            type="number"
            required
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="blue" text @click="closeDialog">Отмена</v-btn>
        <v-btn color="blue" text @click="saveOrganization">
          {{ isEditMode ? "Сохранить" : "Добавить" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import EmployeesApi from "../api/EmployeesApi";
import DepartmentApi from "@/modules/departments/api/DepartmentApi";
import PositionApi from "@/modules/positions/api/PositionApi";
import { format } from "date-fns";
export default {
  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
    isEditMode: {
      type: Boolean,
      required: true,
    },
    TableEmployees: {
      type: Object,
      required: true,
    },
  },
  computed: {
    filteredCities() {
      if (!this.LocalEmployees.region_id) return [];
      return this.citys.filter(
        (city) => city.region_id === this.LocalEmployees.region_id
      );
    },
    filteredPositions() {
      if (!this.LocalEmployees.department_id) return [];
      return this.positions.filter(
        (positions) =>
          positions.department_id === this.LocalEmployees.department_id
      );
    },
  },
  mounted() {
    this.fetchRegions();
    this.fetchCitys();
    this.fetchDepartments();
    this.fetchPositions();
  },
  data() {
    return {
      LocalEmployees: { ...this.TableEmployees },
      maxDate: new Date().toISOString().split("T")[0],
      citiesLoaded: false,
      positionsLoaded: false,
      regions: [],
      citys: [],
      departments: [],
      positions: [],
      date: null,
    };
  },

  watch: {
    TableEmployees: {
      handler(newEmployee) {
        this.LocalEmployees = { ...newEmployee };
      },
      deep: true,
    },
  },
  emits: ["update:dialog", "save"],
  methods: {
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
    formatDate(value) {
      this.date = format(new Date(value), "yyyy-MM-dd");
      this.LocalEmployees.date_of_birth = new Date(this.date);
    },
    closeDialog() {
      this.$emit("update:dialog", false);
    },
    saveOrganization() {
      if (this.isEditMode) this.updateEmployees();
      else this.addEmployees();
    },
    addEmployees() {
      const employeeData = { ...this.LocalEmployees };
      EmployeesApi.addEmployee(employeeData)
        .then(() => {
          this.$emit("save");
          this.closeDialog();
        })
        .catch((err) => console.error(err));
    },
    updateEmployees() {
      EmployeesApi.updateEmployee(this.LocalEmployees.id, {
        ...this.LocalEmployees,
      })
        .then(() => {
          this.$emit("save");
          this.closeDialog();
        })
        .catch((err) => console.error(err));
    },
    onRegionChange() {
      this.LocalEmployees.city_id = null;
    },
    onDepartmentsChange() {
      this.LocalEmployees.position_id = null;
    },
  },
};
</script>
