<template>
  <v-container fluid class="d-flex flex-column" style="padding: 0">
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
      @openSnackBar="openSnackBar"
    />

    <EmployeesDetailsDialog
      :detailsDialog="detailsDialog"
      :TableEmployees="TableEmployees"
      @update:detailsDialog="detailsDialog = $event"
      @openSnackBar="openSnackBar"
    />

    <EmployeesDismissDialog
      :dismissDialog="dismissDialog"
      :TableEmployees="TableEmployees"
      @update:dismissDialog="dismissDialog = $event"
      @dismiss="refreshEmployees"
      @openSnackBar="openSnackBar"
    />

    <EmployeesFilesDialog
      :filesDialog="filesDialog"
      :TableEmployees="TableEmployees"
      @update:filesDialog="filesDialog = $event"
      @openSnackBar="openSnackBar"
    />

    <historyDialog
      :historyDialog="historyDialog"
      :history="historyEmployee"
      @update:historyDialog="historyDialog = $event"
    />

    <EmployeesTable
      ref="EmployeesTable"
      @edit="openEditDialog"
      @dismiss="openDismissDialog"
      @DetailsDialog="openDetailsDialog"
      @FilesDialog="openFilesDialog"
      @history="fetchHistoryEmployees"
      @openSnackBar="openSnackBar"
    />

    <snackBar
      :snackbar="snackbar"
      @update:snackbar="snackbar = $event"
      :settingsSnackBar="localSettingsSnackBar"
    />
  </v-container>
</template>

<script>
import employeesApi from "@/modules/employees/api/employees-api";
import EmployeesForm from "@/modules/employees/components/employees-form.vue";
import EmployeesDetailsDialog from "@/modules/employees/components/employees-details-dialog.vue";
import EmployeesDismissDialog from "@/modules/employees/components/employees-dismiss-dialog.vue";
import EmployeesFilesDialog from "@/modules/employees/components/employees-files-dialog.vue";
import EmployeesTable from "@/modules/employees/components/employees-table.vue";
import historyDialog from "@/shared/components/history-dialog.vue";
import snackBar from "@/shared/components/snack-bar.vue";

export default {
  components: {
    EmployeesForm,
    EmployeesDetailsDialog,
    EmployeesDismissDialog,
    EmployeesFilesDialog,
    EmployeesTable,
    historyDialog,
    snackBar,
  },
  data() {
    return {
      dialog: false,
      isEditMode: false,
      detailsDialog: false,
      dismissDialog: false,
      filesDialog: false,
      historyDialog: false,
      snackbar: false,
      localSettingsSnackBar: {
        error: false,
        text: null,
      },
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
      historyEmployee: [],
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
      this.TableEmployees = { ...item };
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
    fetchHistoryEmployees(item) {
      employeesApi
        .getHistoryEmployees(item.id)
        .then((data) => {
          this.historyEmployee = data;
          this.historyDialog = true;
        })
        .catch((err) => {
          this.settingsSnackBar = {
            error: true,
            text: err.message,
          };
          this.openSnackBar(this.settingsSnackBar);
          this.historyEmployee = [];
        });
    },
    openSnackBar(settingsSnackBar) {
      this.localSettingsSnackBar = settingsSnackBar;
      this.snackbar = true;
    },
  },
};
</script>

<style></style>
