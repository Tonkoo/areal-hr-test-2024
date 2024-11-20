<template>
  <v-dialog
    :model-value="dialog"
    @update:model-value="$emit('update:dialog', $event)"
    max-width="700px"
  >
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
        <v-btn color="blue" text @click="closeDialog">Отмена</v-btn>
        <v-btn
          color="blue"
          text
          @click="saveOrganization"
        >
          {{ isEditMode ? "Сохранить" : "Добавить" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
    isEditMode: {
      type: Boolean,
      required: true,
    },
    TableEmployees: {
      type: Object,
      required: true,
    },
    maxDate:{
      type: String,
      required: true
    },
    regions: {
      type: Array,
      required: true
    },
    citiesLoaded:{
      type: Boolean,
      required: true
    },
    filteredCities:{
      type: Array,
      required: true
    },
    departments:{
      type: Array,
      required: true
    },
    filteredPositions:{
      type: Array,
      required: true
    },
    positionsLoaded:{
      type: Boolean,
      required: true
    }
  },
  emits: ["update:dialog", "save"],
  methods: {
    closeDialog() {
      this.$emit("update:dialog", false);
    },
    saveOrganization() {
      this.$emit("save", this.TableEmployees);
      this.closeDialog();
    },
    onRegionChange() {
      this.TableEmployees.city_id = null;
    },
    onDepartmentsChange() {
      this.TableEmployees.position_id = null;
    },
  },
};
</script>
