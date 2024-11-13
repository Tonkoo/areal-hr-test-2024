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
              header="Дата рождения"
              required
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
            ></v-select>
            <v-select
              v-model="TableEmployees.city_id"
              :items="citys"
              item-title="name"
              item-value="id"
              label="Город"
              required
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
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue" text @click="">Отмена</v-btn>
          <v-btn
            color="blue"
            text
            @click="isEditMode ? updateOrganization() : addOrganization()"
          >
            {{ isEditMode ? "Сохранить" : "Добавить" }}
          </v-btn>
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
            <v-btn color="blue" @click="" small>Подробнее</v-btn>
            <v-btn color="blue" @click="" small>Файлы</v-btn>
            <v-btn color="blue" @click="" small>Изменить</v-btn>
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
      },
      employees: [],
      regions: [],
      citys: [],
    };
  },
  mounted() {
    this.fetchEmployees();
    this.fetchRegions();
    this.fetchCitys();
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
        })
        .catch((error) => {
          console.error("Ошибка при получении городов:", error);
        });
    },

    openAddDialog() {
      this.isEditMode = false;
      this.dialog = true;
    },
  },
};
</script>

<style>
.v-btn {
  margin: 5px;
}
</style>
