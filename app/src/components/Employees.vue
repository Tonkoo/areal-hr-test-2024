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
              @update:model-value="onDepartmentsChange"
            ></v-select>
            <v-select
              v-if="positionsLoaded"
              v-model="TableEmployees.position_id"
              :items="filteredPositions"
              item-title="position_name"
              item-value="id"
              label="Должность"
              required
              :disabled="!TableEmployees.department_id"
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

    <v-dialog v-model="dismissDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Уволить сотрудника</v-card-title>
        <v-card-text>
          Вы уверены, что хотите уволить сотрудника
          {{ selectedEmployee.last_name }} {{ selectedEmployee.first_name }}?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dismissDialog = false"
            >Отмена</v-btn
          >
          <v-btn color="red darken-1" text @click="dismissEmployee"
            >Уволить</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="filesDialog" max-width="600px">
    <v-card>
      <v-card-title class="text-h5 bg-primary">
        <span class="white--text">Файлы сотрудника</span>
      </v-card-title>

      <v-card-text class="pt-4">
        <div v-if="employeeFiles.length > 0">
          <v-list>
            <v-list-item v-for="file in employeeFiles" :key="file.id">
              <v-list-item-content class="d-flex align-center justify-space-between">
                <v-list-item-title class="text-subtitle-1">
                  {{ file.file_name }}
                </v-list-item-title>
                <v-btn
                  icon
                  small
                  color="error"
                  @click="deleteFile(file.id)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </div>
        <v-alert
          v-else
          type="info"
          text
          class="mb-4"
        >
          У сотрудника пока нет загруженных файлов
        </v-alert>     
        <v-file-input
          v-model="newFile"
          show-size
          truncate-length="25"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          label="Выберите файл для загрузки"
          prepend-icon="mdi-paperclip"
          @change="uploadFile"
          class="mt-2"
        >
        </v-file-input>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          text
          @click="filesDialog = false"
        >
          Закрыть
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
import axios from "axios";

export default {
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
      selectedEmployee: null,
      employeeFiles: [],
      newFile: null,
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
      axios
        .get("http://localhost:3000/api/employees")
        .then((response) => {
          this.employees = response.data;
        })
        .catch((error) => {
          console.error("Error retrieving employees:", error);
        });
    },
    fetchRegions() {
      axios
        .get("http://localhost:3000/api/regions")
        .then((response) => {
          this.regions = response.data;
        })
        .catch((error) => {
          console.error("Error retrieving regions:", error);
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
          console.error("Error retrieving cities:", error);
        });
    },
    fetchDepartments() {
      axios
        .get("http://localhost:3000/api/departments")
        .then((response) => {
          this.departments = response.data;
        })
        .catch((error) => {
          console.error("Error retrieving departments:", error);
        });
    },
    fetchPositions() {
      axios
        .get("http://localhost:3000/api/positions")
        .then((response) => {
          this.positions = response.data;
          this.positionsLoaded = true;
        })
        .catch((error) => {
          console.error("Error retrieving positions:", error);
        });
    },
    onRegionChange() {
      this.TableEmployees.city_id = null;
    },
    onDepartmentsChange() {
      this.TableEmployees.position_id = null;
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
      console.log(item.date_of_birth);

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
      console.log(this.TableEmployees.date_of_birth);

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
      this.selectedEmployee = item;
      this.dismissDialog = true;
    },
    dismissEmployee() {
      axios
        .post(`http://localhost:3000/api/employees/${this.selectedEmployee.id}`)
        .then(() => {
          this.dismissDialog = false;
          this.fetchEmployees();
        })
        .catch((error) => {
          console.log(this.selectedEmployee.id);

          console.error("Error dismissing employee:", error);
        });
    },
    openFilesDialog(employee) {
      this.selectedEmployee = employee;
      this.fetchEmployeeFiles(employee.id);
      this.filesDialog = true;
    },
    fetchEmployeeFiles(employeeId) {
      axios
        .get(`http://localhost:3000/api/files/${employeeId}`)
        .then((response) => {
          this.employeeFiles = response.data;
        })
        .catch((error) => {
          console.error("Error fetching employee files:", error);
        });
    },
    uploadFile() {
      if (!this.newFile) return;

      const formData = new FormData();
      formData.append('file', this.newFile);
      formData.append('name', this.newFile.name);

      axios.post(`http://localhost:3000/api/files/${this.selectedEmployee.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(() => {
          this.fetchEmployeeFiles(this.selectedEmployee.id);
          this.newFile = null;
        })
        .catch(error => {
          console.error("Error uploading file:", error);
        });
    },
  },
};
</script>

<style>
.v-btn {
  margin: 5px;
}
</style>
