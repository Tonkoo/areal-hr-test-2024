<script>
import Sidebar from './shared/components/Sidebar.vue';

export default {
  components: {
    Sidebar
  }
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

<style scoped>

</style>