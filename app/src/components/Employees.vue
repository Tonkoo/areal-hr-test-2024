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

    <v-dialog v-model="dialog" max-width="700px">
      <v-card>
        <v-card-title class="headline">{{
          isEditMode ? "Изменить данные сотрудника" : "Добавить сотрудника"
        }}</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="TableEmployees.last_name"
              label="Фамилия"
              required
            ></v-text-field>
            <v-text-field
              v-model="TableEmployees.first_name"
              label="Имя"
              required
            ></v-text-field>
            <v-text-field
              v-model="TableEmployees.middle_name"
              label="Отчество"
              required
            ></v-text-field>
            <v-date-picker
              v-model="TableEmployees.date_of_birth"
              :max="maxDate"
            ></v-date-picker>
            <v-text-field
              v-model="TableEmployees.passport_series"
              label="Серия паспорта"
              required
            ></v-text-field>
            <v-text-field
              v-model="TableEmployees.passport_number"
              label="Номер паспорта"
              required
            ></v-text-field>
            <v-select
              v-model="TableEmployees.region_id"
              :items="regions"
              item-title="name"
              item-value="id"
              label="Регион"
              required
              @update:model-value="onRegionChange"
            ></v-select>
            <v-select
              v-if="citiesLoaded"
              v-model="TableEmployees.city_id"
              :items="filteredCities"
              item-title="name"
              item-value="id"
              label="Город"
              required
              :disabled="!TableEmployees.region_id"
            ></v-select>
            <v-text-field
              v-model="TableEmployees.street"
              label="Улица"
              required
            ></v-text-field>
            <v-text-field
              v-model="TableEmployees.house"
              label="Дом"
              required
            ></v-text-field>
            <v-text-field
              v-model="TableEmployees.building"
              label="Корпус"
              required
            ></v-text-field>
            <v-text-field
              v-model="TableEmployees.apartment"
              type="number"
              label="Квартира"
              required
            ></v-text-field>
            <v-select
              v-model="TableEmployees.department_id"
              :items="departments"
              item-title="department_name"
              item-value="department_id"
              label="Отдел"
              required
            ></v-select>
            <v-select
              v-model="TableEmployees.position_id"
              :items="positions"
              item-title="position_name"
              item-value="id"
              label="Должность"
              required
            ></v-select>
            <v-text-field
              v-model="TableEmployees.salary"
              label="Зарплата"
              type="number"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue" text @click="dialog = false">Отмена</v-btn>
          <v-btn
            color="blue"
            text
            @click="isEditMode ? updateEmployees() : addEmployees()"
          >
            {{ isEditMode ? "Сохранить" : "Добавить" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="detailsDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline"
          >Подробная информация о сотруднике</v-card-title
        >
        <v-card-text>
          <v-list>
            <v-list-item>
              <v-list-item-title>Отдел</v-list-item-title>
              <v-list-item-subtitle>{{
                TableEmployees.department_name
              }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Должность</v-list-item-title>
              <v-list-item-subtitle>{{
                TableEmployees.position_name
              }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Зарплата</v-list-item-title>
              <v-list-item-subtitle
                >{{ TableEmployees.salary }} руб.</v-list-item-subtitle
              >
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="detailsDialog = false"
            >Закрыть</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

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
          <td>
            <v-btn color="blue" @click="openDetailsDialog(item)" small
              >Подробнее</v-btn
            >
            <v-btn color="blue" @click="" small>Файлы</v-btn>
            <v-btn color="blue" @click="openEditDialog(item)" small
              >Изменить</v-btn
            >
            <v-btn color="red" @click="" small>Уволить</v-btn>
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
      isEditMode: false,
      detailsDialog: false,
      deleteDialog: false,
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
    };
  },
  computed: {
    filteredCities() {
      if (!this.TableEmployees.region_id) return [];
      return this.citys.filter(
        (city) => city.region_id === this.TableEmployees.region_id
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
      axios
        .get("http://localhost:3000/api/employees")
        .then((response) => {
          this.employees = response.data;
        })
        .catch((error) => {
          console.error("Ошибка при получении сотрудников:", error);
        });
    },
    fetchRegions() {
      axios
        .get("http://localhost:3000/api/regions")
        .then((response) => {
          this.regions = response.data;
        })
        .catch((error) => {
          console.error("Ошибка при получении регионов:", error);
        });
    },
    fetchCitys() {
      axios
        .get("http://localhost:3000/api/citys")
        .then((response) => {
          this.citys = response.data;
          this.citiesLoaded = true;
        })
        .catch((error) => {
          console.error("Ошибка при получении городов:", error);
        });
    },
    fetchDepartments() {
      axios
        .get("http://localhost:3000/api/departments")
        .then((response) => {
          this.departments = response.data;
        })
        .catch((error) => {
          console.error("Ошибка при получении отделов:", error);
        });
    },
    fetchPositions() {
      axios
        .get("http://localhost:3000/api/positions")
        .then((response) => {
          this.positions = response.data;
        })
        .catch((error) => {
          console.error("Ошибка при получении должностей:", error);
        });
    },
    onRegionChange() {
      this.TableEmployees.city_id = null;
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
      };
      this.dialog = true;
    },
    addEmployees() {
      axios
        .post("http://localhost:3000/api/employees", {
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
      };
      this.dialog = true;
    },
    updateEmployees() {
      axios
        .put(`http://localhost:3000/api/employees/${this.TableEmployees.id}`, {
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
  },
};
</script>

<style>
.v-btn {
  margin: 5px;
}
</style>
