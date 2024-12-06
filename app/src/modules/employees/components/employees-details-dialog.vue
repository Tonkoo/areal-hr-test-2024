<template>
  <v-dialog
    :model-value="detailsDialog"
    @update:model-value="$emit('update:dialog', $event)"
    max-width="500px"
  >
    <v-card>
      <v-card-title class="headline"
        >Подробная информация о сотруднике</v-card-title
      >
      <v-card-text>
        <v-list>
          <v-list-item>
            <v-list-item-title>Дата рождения</v-list-item-title>
            <v-list-item-subtitle>{{
              TableEmployees.date_of_birth
            }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Серия паспорта</v-list-item-title>
            <v-list-item-subtitle>{{
              TableEmployees.passport_series
            }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Номер паспорта</v-list-item-title>
            <v-list-item-subtitle>{{
              TableEmployees.passport_number
            }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Регион</v-list-item-title>
            <v-list-item-subtitle>{{
              TableEmployees.region
            }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Город</v-list-item-title>
            <v-list-item-subtitle>{{
              TableEmployees.city
            }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Улица</v-list-item-title>
            <v-list-item-subtitle>{{
              TableEmployees.street
            }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Дом</v-list-item-title>
            <v-list-item-subtitle
              >№{{ TableEmployees.house }}</v-list-item-subtitle
            >
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Корпус</v-list-item-title>
            <v-list-item-subtitle>{{
              TableEmployees.building
            }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Квартира</v-list-item-title>
            <v-list-item-subtitle
              >№{{ TableEmployees.apartment }}</v-list-item-subtitle
            >
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeDialog">Закрыть</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    detailsDialog: {
      type: Boolean,
      required: true,
    },
    TableEmployees: {
      type: Object,
      required: true,
    },
  },
  emits: ["update:detailsDialog"],
  methods: {
    closeDialog() {
      this.$emit("update:detailsDialog", false);
    },
  },
};
</script>
