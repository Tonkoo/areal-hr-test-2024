<script>
import SideBar from "./shared/components/sidebar.vue";
import { useAuthStore } from "@/stores/use-auth-store";

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
