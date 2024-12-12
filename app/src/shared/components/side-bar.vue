<script>
import SideBarApi from "../../modules/sidebar/api/sidebar-api";
import sideBarDialogLogOut from "@/modules/sidebar/components/sidebar-dialog-log-out.vue";

export default {
  components: {
    sideBarDialogLogOut,
  },
  data() {
    return {
      drawer: true,
      menuItems: [
        { id: 1, name: "Главная", route: "/home" },
        { id: 2, name: "Организации", route: "/organizations" },
        { id: 3, name: "Отделы", route: "/departments" },
        { id: 4, name: "Должности", route: "/positions" },
        { id: 5, name: "Сотрудники", route: "/employees" },
        {
          id: 6,
          name: "Пользователи",
          route: "/users",
          roles: ["Администратор"],
        },
      ],
      logOutDialog: false,
    };
  },
  async mounted() {
    this.checkUserRole();
  },
  methods: {
    async checkUserRole() {
      const userRole = await SideBarApi.getUserRole();
      this.menuItems = this.menuItems.filter(
        (item) => !item.roles || item.roles.includes(userRole)
      );
    },
    logOut() {
      this.logOutDialog = true;
    },
  },
};
</script>

<template>
  <v-navigation-drawer app v-model="drawer" permanent>
    <v-list-item class="sidebar-header">
      <v-list-item-title class="sidebar-title">HR-Manager</v-list-item-title>
    </v-list-item>
    <v-list>
      <v-list-item
        v-for="item in menuItems"
        :key="item.id"
        :to="item.route"
        router
      >
        <v-list-item-title>{{ item.name }}</v-list-item-title>
      </v-list-item>
      <v-list-item @click="logOut">
        <v-list-item-title>Выйти из аккаунта</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <sideBarDialogLogOut
    :logOutDialog="logOutDialog"
    @update:logOutDialog="logOutDialog = $event"
  />
</template>

<style scoped>
.sidebar-header {
  background-color: #1976d2;
  color: white;
  padding: 16px;
}

.sidebar-title {
  font-size: 20px;
  font-weight: bold;
  color: white;
}
</style>
