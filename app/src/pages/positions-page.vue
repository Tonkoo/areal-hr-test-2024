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
      @update:dialog="dialog = $event"
      @save="refreshPosition"
    />

    <PositionDeleteDialog
      :deleteDialog="deleteDialog"
      :deletePositionId="deletePositionId"
      @update:deleteDialog="deleteDialog = $event"
      @delete="refreshPosition"
    />

    <PositionTable
      ref="PositionTable"
      @edit="openEditDialog"
      @delete="openDeleteDialog"
    />
  </v-container>
</template>

<script>
import PositionForm from "@/modules/positions/components/position-form.vue";
import PositionDeleteDialog from "@/modules/positions/components/position-delete-dialog.vue";
import PositionTable from "@/modules/positions/components/position-table.vue";

export default {
  components: {
    PositionForm,
    PositionDeleteDialog,
    PositionTable,
  },
  data() {
    return {
      dialog: false,
      isEditMode: false,
      deleteDialog: false,
      deletePositionId: 0,
      TablePosition: {
        id: null,
        position_name: "",
        department_id: null,
      },
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
  },
};
</script>

<style>
.v-btn {
  margin-right: 8px;
}
</style>
