<template>
  <v-app>
    <headerSite v-if="isAuthenticated" />
    <SideBar v-if="isAuthenticated" />
    <v-main app>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import SideBar from "./shared/components/side-bar.vue";
import headerSite from "./shared/components/header-site.vue";
import { useAuthStore } from "@/stores/use-auth-store";

export default {
  components: {
    SideBar,
    headerSite,
  },
  computed: {
    isAuthenticated() {
      const authStore = useAuthStore();
      return authStore.isAuthenticated;
    },
  },
};
</script>

<style scoped></style>
