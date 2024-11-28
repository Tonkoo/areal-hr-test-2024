<script>
import SideBar from "../src/shared/components/SideBar.vue";

export default {
  components: {
    SideBar,
  },
};
</script>

<template>
  <v-app>
    <SideBar />
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<style scoped></style>
