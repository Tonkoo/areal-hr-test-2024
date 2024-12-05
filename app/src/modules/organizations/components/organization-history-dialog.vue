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
          <tr v-for="item in historyOrganization" :key="item.id">
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
import OrganizationsApi from "@/modules/organizations/api/organizations-api";

export default {
  props: {
    historyDialog: {
      type: Boolean,
      required: true,
    },
    organization: {
      type: Object,
      required: true,
    },
  },
  emits: ["update:historyDialog", "save"],
  data() {
    return {
      localOrganization: { ...this.organization },
      historyOrganization: {},
      errors: {},
    };
  },
  watch: {
    historyDialog(newValue) {
      if (newValue) {
        this.fetchHistoryOrganizations();
      }
    },
    organization: {
      handler(newOrganization) {
        this.localOrganization = { ...newOrganization };
      },
      deep: true,
    },
  },
  methods: {
    closeDialog() {
      this.errors = [];
      this.$emit("update:historyDialog", false);
    },
    fetchHistoryOrganizations() {
      OrganizationsApi.getHistoryOrganizations(this.localOrganization.id)
        .then((data) => {
          this.historyOrganization = data;
          console.log(this.historyOrganization);
        })
        .catch((err) => {
          console.error("Error fetching history organizations:", err);
          this.historyOrganization = [];
        });
    },
    formatHistory(value) {
      if (!value) return "";
      return value.replace(/\n/g, "<br>");
    },
  },
};
</script>
