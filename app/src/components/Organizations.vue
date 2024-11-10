<template>
  <v-container>
    <v-data-table :headers="headers" :items="organizations" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Organizations</v-toolbar-title>
        </v-toolbar>
      </template>

      <template v-slot:item.name="{ item }">
        <span>{{ item.name }}</span>
      </template>
      <template v-slot:item.address="{ item }">
        <span>{{ item.address }}</span>
      </template>
      <template v-slot:item.phone="{ item }">
        <span>{{ item.phone }}</span>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      organizations: [],
      headers: [
        { text: "Name", value: "name" },
        { text: "Address", value: "address" },
        { text: "Phone", value: "phone" },
      ],
    };
  },
  mounted() {
    axios
      .get("http://localhost:3000/api/organizations")
      .then((response) => {
        if (Array.isArray(response.data)) {
          this.organizations = response.data;
        } else {
          console.error("Expected an array but got:", response.data);
          this.organizations = [];
        }
      })
      .catch((error) => {
        console.error("Error fetching organizations:", error);
      });
  },
};
</script>

<style scoped>
.v-data-table {
  margin-top: 20px;
}
</style>
