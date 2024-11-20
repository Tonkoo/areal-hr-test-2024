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

    <PositionTable
      :positions="positions"
      @edit="openEditDialog"
      @delete="openDeleteDialog"
    />
  </v-container>
</template>

<script>
import PositionForm from "@/modules/positions/components/PositionForm.vue";
import PositionDeleteDialog from "@/modules/positions/components/PositionDeleteDialog.vue";
import PositionTable from "@/modules/positions/components/PositionTable.vue";
import PositionApi from "@/modules/positions/api/PositionApi";
import DepartmentApi from "@/modules/departments/api/DepartmentApi";

export default {
  components: {
    PositionForm,
    PositionDeleteDialog,
    PositionTable
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
      PositionApi.getPosition()
        .then((data) => {
          this.positions = data;
        })
        .catch((err) => {
          console.error("Error fetching positions:", err);
          this.positions = [];
        });
    },
    fetchDepartments() {
      DepartmentApi.getDepartments()
        .then((data) => {
          this.departments = data;
        })
        .catch((err) => {
          console.error("Error fetching departments:", err);
          this.departments = [];
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
      if (this.TablePosition.position_name && this.TablePosition.department_id) {
        PositionApi.addPosition({
          position_name: this.TablePosition.position_name,
          department_id: this.TablePosition.department_id
        })
          .then(() => {
            this.fetchPosition();
            this.dialog = false;
            this.TablePosition.position_name = "";
            this.TablePosition.department_id = null;
          })
          .catch((err) => {
            console.error("Error adding position:", err);
          });
      }
    },
    updatePosition() {
      PositionApi.updatePosition(this.TablePosition.id, {
        position_name: this.TablePosition.position_name,
        department_id: this.TablePosition.department_id,
      })
        .then(() => {
          this.fetchPosition();
          this.dialog = false;
          this.TablePosition = { id: null, position_name: "", department_id: null };
        })
        .catch((err) => {
          console.error("Error updating position:", err);
        });
    },
    openDeleteDialog(id) {
      this.deletePositionId = id;
      this.deleteDialog = true;
    },
    deletePosition() {
      if (this.deletePositionId !== null) {
        PositionApi.deletePosition(this.deletePositionId)
          .then(() => {
            this.fetchPosition();
            this.deleteDialog = false;
            this.deletePositionId = null;
          })
          .catch((err) => {
            console.error("Error deleting position:", err);
          });
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
