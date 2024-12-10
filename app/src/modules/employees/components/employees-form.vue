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
            :error-messages="errors.last_name"
            required
          ></v-text-field>
          <v-text-field
            v-model="LocalEmployees.first_name"
            label="Имя"
            :error-messages="errors.first_name"
            required
          ></v-text-field>
          <v-text-field
            v-model="LocalEmployees.middle_name"
            label="Отчество"
            :error-messages="errors.middle_name"
          ></v-text-field>
          <v-date-picker
            v-model="LocalEmployees.date_of_birth"
            title="Дата рождения"
            locale="ru-RU"
            :max="maxDate"
            @update:model-value="formatDate"
            :error-messages="errors.date_of_birth"
            required
          >
            <template v-slot:title>
              <span :class="{ 'error-text': isErrorsDate }">
                {{ isErrorsDate ? errors.date_of_birth : "Дата рождения" }}
              </span>
            </template></v-date-picker
          >
          <v-text-field
            v-model="LocalEmployees.passport_series"
            label="Серия паспорта"
            :error-messages="errors.passport_series"
            required
          ></v-text-field>
          <v-text-field
            v-model="LocalEmployees.passport_number"
            label="Номер паспорта"
            val
            :error-messages="errors.passport_number"
            required
          ></v-text-field>
          <v-select
            v-model="LocalEmployees.region_id"
            :items="regions"
            item-title="name"
            item-value="id"
            label="Регион"
            :error-messages="errors.region_id"
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
            :error-messages="errors.city_id"
            required
            :disabled="!LocalEmployees.region_id"
          ></v-select>
          <v-text-field
            v-model="LocalEmployees.street"
            label="Улица"
            :error-messages="errors.street"
            required
          ></v-text-field>
          <v-text-field
            v-model="LocalEmployees.house"
            label="Номер дома"
            :error-messages="errors.house"
            required
          ></v-text-field>
          <v-text-field
            v-model="LocalEmployees.building"
            label="Корпус дома"
            :error-messages="errors.building"
          ></v-text-field>
          <v-text-field
            v-model="LocalEmployees.apartment"
            type="number"
            label="Квартира"
            :error-messages="errors.apartment"
          ></v-text-field>
          <v-select
            v-model="LocalEmployees.department_id"
            :items="departments"
            item-title="department_name"
            item-value="department_id"
            label="Отдел"
            :error-messages="errors.department_id"
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
            :error-messages="errors.position_id"
            required
            :disabled="!LocalEmployees.department_id"
          ></v-select>
          <v-text-field
            v-model="LocalEmployees.salary"
            label="Зарплата"
            type="number"
            :error-messages="errors.salary"
            required
          ></v-text-field>
          <div v-if="!isEditMode">
            <v-file-input
              v-model="newFile"
              show-size
              truncate-length="25"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              label="Выберите файл сотрудника для загрузки"
              prepend-icon="mdi-paperclip"
              @change="addFiles"
              class="mt-2"
              :error-messages="errors.file"
            >
            </v-file-input>
            <v-card-text class="pt-4">
              <div v-if="employeeFiles.length > 0">
                <v-list>
                  <v-list-item
                    v-for="(file, index) in employeeFiles"
                    :key="index"
                  >
                    <div class="d-flex align-center justify-space-between">
                      <v-list-item-title class="text-subtitle-1">
                        {{ file.name }}
                      </v-list-item-title>
                      <v-btn
                        icon
                        small
                        color="error"
                        @click="removeFile(index)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </div>
                  </v-list-item>
                </v-list>
              </div>
              <v-alert v-else type="info" text class="mb-4">
                Пока нет загруженных файлов
              </v-alert>
            </v-card-text>
          </div>
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
import EmployeesApi from "../api/employees-api";
import DepartmentApi from "@/modules/departments/api/department-api";
import PositionApi from "@/modules/positions/api/position-api";
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
      employeeFiles: [],
      newFile: null,
      date: null,
      errors: {},
      isErrorsDate: false,
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
      this.errors = [];
      this.isErrorsDate = false;
      this.$emit("update:dialog", false);
    },
    saveOrganization() {
      if (this.isEditMode) this.updateEmployees();
      else this.addEmployees();
    },
    addEmployees() {
      if (this.employeeFiles.length > 0) {
        const employeeData = { ...this.LocalEmployees };
        EmployeesApi.addEmployee(employeeData, this.employeeFiles)
          .then(() => {
            this.isErrorsDate = false;
            this.errors = [];
            this.$emit("save");
            this.closeDialog();
          })
          .catch((err) => {
            this.errors = err;
            if (this.errors.date_of_birth) this.isErrorsDate = true;
            else this.isErrorsDate = false;
            console.error("Error adding employee:", err);
          });
      } else this.errors.file = "Не загружен ни один файл";
    },
    updateEmployees() {
      EmployeesApi.updateEmployee(this.LocalEmployees.id, {
        ...this.LocalEmployees,
      })
        .then(() => {
          this.isErrorsDate = false;
          this.errors = [];
          this.$emit("save");
          this.closeDialog();
        })
        .catch((err) => {
          this.errors = err;
          if (this.errors.date_of_birth) this.isErrorsDate = true;
          else this.isErrorsDate = false;
          console.error("Error updating employee:", err);
        });
    },
    onRegionChange() {
      this.LocalEmployees.city_id = null;
    },
    onDepartmentsChange() {
      this.LocalEmployees.position_id = null;
    },
    addFiles() {
      if (this.newFile) {
        this.employeeFiles.push(this.newFile);
        this.newFile = null;
      }
    },
    removeFile(index) {
      this.employeeFiles.splice(index, 1);
    },
  },
};
</script>
<style scoped>
.error-text {
  color: #b00020;
}
</style>
