<script>
import Sidebar from "../src/shared/components/Sidebar.vue";

export default {
  components: {
    Sidebar,
  },
};
</script>

<template>
  <v-app>
    <Sidebar />
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<style scoped></style>
