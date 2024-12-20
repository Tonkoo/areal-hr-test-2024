<template>
  <v-dialog
    :model-value="historyDialog"
    @update:model-value="$emit('update:historyDialog', $event)"
    max-width="1000px"
  >
    <v-card>
      <v-card-title class="headline">История записи</v-card-title>
      <v-table>
        <thead>
          <tr>
            <th>Код</th>
            <th>Дата операции</th>
            <th>Автор</th>
            <th>Старое значение</th>
            <th>Новое значение</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in history" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.datetime_operations }}</td>
            <td>{{ item.full_name }}</td>
            <td v-html="formatHistory(item.old_value)"></td>
            <td v-html="formatHistory(item.new_value)"></td>
          </tr>
        </tbody>
      </v-table>
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
    historyDialog: {
      type: Boolean,
      required: true,
    },
    history: {
      type: Object,
      required: true,
    },
  },
  emits: ["update:historyDialog"],
  data() {
    return {};
  },
  methods: {
    closeDialog() {
      this.$emit("update:historyDialog", false);
    },
    formatHistory(value) {
      if (!value) return "";
      return value.replace(/\n/g, "<br>");
    },
  },
};
</script>
