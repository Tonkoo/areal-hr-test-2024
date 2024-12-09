<template>
  <v-table>
    <thead>
      <tr>
        <th>Код</th>
        <th>Организация</th>
        <th>Комментарий</th>
        <th>Действие</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in organizations" :key="item.id">
        <td>{{ item.id }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.comment }}</td>
        <td>
          <v-btn color="blue" @click="openEditDialog(item)" small
            >Изменить</v-btn
          >
          <v-btn color="red" @click="openDeleteDialog(item.id)" small
            >Удалить</v-btn
          >
          <v-btn color="blue" @click="openHistoryDialog(item)" small
            >История</v-btn
          >
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script>
import OrganizationsApi from "../api/organizations-api";
export default {
  data() {
    return {
      organizations: [],
    };
  },
  mounted() {
    this.fetchOrganizations();
  },
  methods: {
    openEditDialog(item) {
      this.$emit("edit", item);
    },
    openDeleteDialog(id) {
      this.$emit("delete", id);
    },
    fetchOrganizations() {
      OrganizationsApi.getOrganizations()
        .then((data) => {
          this.organizations = data;
        })
        .catch((err) => {
          console.error("Error fetching organizations:", err);
          this.organizations = [];
        });
    },
    openHistoryDialog(item) {
      this.$emit("history", item);
    },
  },
};
</script>
<style scoped>
.v-btn {
  margin-right: 8px;
}
</style>
