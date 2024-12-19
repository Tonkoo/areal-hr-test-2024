<template>
  <v-dialog
    :model-value="historyDialog"
    @update:model-value="$emit('update:historyDialog', $event)"
    max-width="1000px"
  >
    <v-card>
      <v-card-title class="headline">История записиы</v-card-title>
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
          <tr v-for="item in historyUser" :key="item.id">
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
import usersApi from "../api/users-api";

export default {
  props: {
    historyDialog: {
      type: Boolean,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
  },
  emits: ["update:historyDialog", "save", "openSnackBar"],
  data() {
    return {
      localUser: { ...this.user },
      historyUser: {},
    };
  },
  watch: {
    historyDialog(newValue) {
      if (newValue) {
        this.$nextTick(() => {
          this.fetchHistoryUser();
        });
      }
    },
    user: {
      handler(newUser) {
        this.localUser = { ...newUser };
      },
      deep: true,
    },
  },
  methods: {
    closeDialog() {
      this.$emit("update:historyDialog", false);
    },
    fetchHistoryUser() {
      usersApi
        .getHistoryUsers(this.localUser.id)
        .then((data) => {
          this.historyUser = data;
        })
        .catch((err) => {
          this.settingsSnackBar = {
            error: true,
            text: err.message,
          };
          this.$emit("openSnackBar", this.settingsSnackBar);
          this.historyUser = [];
        });
    },
    formatHistory(value) {
      if (!value) return "";
      return value.replace(/\n/g, "<br>");
    },
  },
};
</script>
