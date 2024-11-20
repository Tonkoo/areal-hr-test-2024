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

    <PositionForm
      :dialog="dialog"
      :isEditMode="isEditMode"
      :TablePosition="TablePosition"
      :departments="departments"
      @update:dialog="dialog = $event"
      @save="handleSavePosition"
    />

    <PositionDeleteDialog
      :deleteDialog="deleteDialog"
      @update:deleteDialog="deleteDialog = $event"
      @delete="deletePosition"
    />

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
            <v-btn color="blue" @click="openEditDialog(item)" small
              >Изменить</v-btn
            >
            <v-btn color="red" @click="openDeleteDialog(item.id)" small
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
import PositionForm from "@/modules/positions/components/PositionForm.vue";
import PositionDeleteDialog from "@/modules/positions/components/PositionDeleteDialog.vue";

export default {
  components: {
    PositionForm,
    PositionDeleteDialog,
  },
  data() {
    return {
      dialog: false,
      isEditMode: false,
      deleteDialog: false,
      deletePositionId: null,
      TablePosition: {
        id: null,
        position_name: "",
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
      api
        .get("/positions")
        .then((response) => {
          this.positions = response.data;
        })
        .catch((error) => {
          console.error("Error fetching positions:", error);
        });
    },
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
    openAddDialog() {
      this.TablePosition = { position_name: "", department_id: null };
      this.isEditMode = false;
      this.dialog = true;
    },
    openEditDialog(item) {
      this.isEditMode = true;
      this.TablePosition = {
        id: item.id,
        position_name: item.position_name,
        department_id: this.departments.find(
          (d) => d.department_name === item.department_name
        )?.department_id,
      };
      this.dialog = true;
    },
    handleSavePosition(position) {
      if (this.isEditMode) {
        this.updatePosition(position);
      } else {
        this.addPosition(position);
      }
    },
    addPosition() {
      api
        .post("/positions", {
          position_name: this.TablePosition.position_name,
          department_id: this.TablePosition.department_id,
        })
        .then((response) => {
          this.positions.push(response.data);
          this.dialog = false;
          this.fetchPosition();
        })
        .catch((error) => {
          console.error("Error adding position:", error);
        });
    },
    updatePosition() {
      api
        .put(`/positions/${this.TablePosition.id}`, {
          position_name: this.TablePosition.position_name,
          department_id: this.TablePosition.department_id,
        })
        .then(() => {
          this.dialog = false;
          this.fetchPosition();
        })
        .catch((error) => {
          console.error("Error updating position:", error);
        });
    },
    openDeleteDialog(id) {
      this.deletePositionId = id;
      this.deleteDialog = true;
    },
    deletePosition() {
      api
        .delete(`/positions/${this.deletePositionId}`)
        .then(() => {
          this.fetchPosition();
          this.deleteDialog = false;
          this.deletePositionId = null;
        })
        .catch((error) => {
          console.error("Error deleting position:", error);
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
