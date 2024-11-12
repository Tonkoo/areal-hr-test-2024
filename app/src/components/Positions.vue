<template>
  <v-container
    fluid
    class="d-flex flex-column"
    style="height: 100vh; padding: 0"
  >
    <v-toolbar flat>
      <v-toolbar-title>Должности</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        color="deep-purple accent-4"
        @click="openAddDialog()"
        elevation="10"
        class="white--text"
      >
        Добавить
      </v-btn>
    </v-toolbar>

    <v-dialog v-model="dialog" max-width="700px">
      <v-card>
        <v-card-title class="headline">{{
          isEditMode ? "Изменить должность" : "Добавить должность"
        }}</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="TablePosition.name"
              label="Название должности"
              required
            ></v-text-field>
            <v-select
              v-model="TablePosition.department_id"
              :items="departments"
              item-title="department_name"
              item-value="department_id"
              label="Отдел"
              required
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue" text @click="dialog = false">Отмена</v-btn>
          <v-btn
            color="blue"
            text
            @click="isEditMode ? updateOrganization() : addPosition()"
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
          <th>Должность</th>
          <th>Отдел</th>
          <th>Действие</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in positions" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.position_name }}</td>
          <td>{{ item.department_name }}</td>
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
      TablePosition: {
        id: null,
        name: "",
        department_id: null,
      },
      positions: [],
      departments: [],
    };
  },
  mounted() {
    this.fetchPosition();
    this.fetchDepartments();
  },
  methods: {
    fetchPosition() {
      axios
        .get("http://localhost:3000/api/positions")
        .then((response) => {
          this.positions = response.data;
        })
        .catch((error) => {
          console.error("Ошибка при получении должностей:", error);
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
    openAddDialog() {
      this.TablePosition = { name: "", department_id: null };
      this.dialog = true;
    },
    addPosition() {
      axios
        .post("http://localhost:3000/api/positions", {
          name: this.TablePosition.name,
          department_id: this.TablePosition.department_id,
        })
        .then((response) => {
          this.positions.push(response.data);
          this.dialog = false;
          this.fetchPosition();
        })
        .catch((error) => {
          console.error("Ошибка при добавлении должности:", error);
        });
    },
  },
};
</script>

<style>
.v-btn {
  margin-right: 8px;
}
</style>
