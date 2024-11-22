<template>
  <v-container
    fluid
    class="d-flex flex-column"
    style="height: 100vh; padding: 0"
  >
    <v-toolbar flat>
      <v-toolbar-title>Кадровые операции</v-toolbar-title>
    </v-toolbar>
    <OperationTable
    :operations = "operations"
    />
  </v-container>
</template>

<script>
import OperationTable from "@/modules/operations/components/OperationTable.vue";
import OperationApi from "@/modules/operations/api/OperationApi";

export default {
  components:{
    OperationTable
  },
  data() {
    return {
      operations: [],
    };
  },
  mounted() {
    this.fetchOperations();
  },
  methods: {
    fetchOperations() {
      OperationApi.getOperations()
        .then((data) => {
          this.operations = data;
        })
        .catch((err) => {
          console.error("Error fetching operations:", err);
          this.operations = [];
        });
    },
  },
};
</script>

<style>

</style>
