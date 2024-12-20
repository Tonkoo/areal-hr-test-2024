<template>
  <v-container fluid class="d-flex flex-column" style="padding: 0">
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
      @update:dialog="dialog = $event"
      @save="refreshPosition"
      @openSnackBar="openSnackBar"
    />

    <PositionDeleteDialog
      :deleteDialog="deleteDialog"
      :deletePositionId="deletePositionId"
      @update:deleteDialog="deleteDialog = $event"
      @delete="refreshPosition"
      @openSnackBar="openSnackBar"
    />

    <historyDialog
      :historyDialog="historyDialog"
      :history="historyPosition"
      @update:historyDialog="historyDialog = $event"
    />

    <PositionTable
      ref="PositionTable"
      @edit="openEditDialog"
      @delete="openDeleteDialog"
      @history="fetchHistoryPositions"
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
import positionApi from "@/modules/positions/api/position-api";
import PositionForm from "@/modules/positions/components/position-form.vue";
import PositionDeleteDialog from "@/modules/positions/components/position-delete-dialog.vue";
import PositionTable from "@/modules/positions/components/position-table.vue";
import historyDialog from "@/shared/components/history-dialog.vue";
import snackBar from "@/shared/components/snack-bar.vue";

export default {
  components: {
    PositionForm,
    PositionDeleteDialog,
    PositionTable,
    historyDialog,
    snackBar,
  },
  data() {
    return {
      dialog: false,
      isEditMode: false,
      deleteDialog: false,
      historyDialog: false,
      deletePositionId: 0,
      snackbar: false,
      localSettingsSnackBar: {
        error: false,
        text: null,
      },
      TablePosition: {
        id: null,
        position_name: "",
        department_id: null,
      },
      historyPosition: [],
    };
  },
  methods: {
    refreshPosition() {
      this.$refs.PositionTable.fetchPosition();
    },
    openAddDialog() {
      this.TablePosition = [];
      this.isEditMode = false;
      this.dialog = true;
    },
    openEditDialog(item) {
      this.isEditMode = true;
      this.TablePosition = { ...item };
      this.dialog = true;
    },
    openDeleteDialog(id) {
      this.deletePositionId = id;
      this.deleteDialog = true;
    },
    fetchHistoryPositions(item) {
      positionApi
        .getHistoryPositions(item.id)
        .then((data) => {
          this.historyPosition = data;
          this.historyDialog = true;
        })
        .catch((err) => {
          this.settingsSnackBar = {
            error: true,
            text: err.message,
          };
          this.openSnackBar(this.settingsSnackBar);
          this.historyPosition = [];
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
