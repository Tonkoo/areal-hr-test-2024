<script>
import SideBar from "../src/shared/components/SideBar.vue";
import { useAuthStore } from "@/stores/useAuthStore";

export default {
  components: {
    SideBar,
  },
  computed: {
    isAuthenticated() {
      const authStore = useAuthStore();
      return authStore.isAuthenticated;
    },
  },
};
</script>

<template>
  <v-app>
    <SideBar v-if="isAuthenticated" />
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<style scoped></style>
