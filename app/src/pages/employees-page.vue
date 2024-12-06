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
      @save="refreshEmployees"
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
      @dismiss="refreshEmployees"
    />

    <EmployeesFilesDialog
      :filesDialog="filesDialog"
      :TableEmployees="TableEmployees"
      @update:filesDialog="filesDialog = $event"
    />

    <EmployeesTable
      ref="EmployeesTable"
      @edit="openEditDialog"
      @dismiss="openDismissDialog"
      @DetailsDialog="openDetailsDialog"
      @FilesDialog="openFilesDialog"
    />
  </v-container>
</template>

<script>
import EmployeesForm from "@/modules/employees/components/employees-form.vue";
import EmployeesDetailsDialog from "@/modules/employees/components/employees-details-dialog.vue";
import EmployeesDismissDialog from "@/modules/employees/components/employees-dismiss-dialog.vue";
import EmployeesFilesDialog from "@/modules/employees/components/employees-files-dialog.vue";
import EmployeesTable from "@/modules/employees/components/employees-table.vue";

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
    };
  },
  methods: {
    refreshEmployees() {
      this.$refs.EmployeesTable.fetchEmployees();
    },
    openAddDialog() {
      this.isEditMode = false;
      this.TableEmployees = [];
      this.dialog = true;
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
        region_id: item.region_id,
        city_id: item.city_id,
        street: item.street,
        house: item.house,
        building: item.building,
        apartment: item.apartment,
        department_id: item.department_id,
        position_id: item.position_id,
        salary: parseFloat(item.salary.replace(/[$,]/g, "")),
      };
      this.dialog = true;
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
    openFilesDialog(item) {
      this.TableEmployees = item;
      this.filesDialog = true;
    },
  },
};
</script>

<style></style>
