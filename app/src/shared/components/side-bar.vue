<template>
  <v-navigation-drawer app v-model="drawer" permanent>
    <v-list>
      <v-list-item
        v-for="item in menuItems"
        :key="item.id"
        :to="item.route"
        router
      >
        <v-list-item-title>{{ item.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import authorizationApi from "@/modules/authorization/api/authorization-api";

export default {
  data() {
    return {
      drawer: true,
      menuItems: [
        {
          id: 1,
          name: "Организации",
          route: "/organizations",
          roles: ["Кадровый сотрудник"],
        },
        {
          id: 2,
          name: "Отделы",
          route: "/departments",
          roles: ["Кадровый сотрудник"],
        },
        {
          id: 3,
          name: "Должности",
          route: "/positions",
          roles: ["Кадровый сотрудник"],
        },
        {
          id: 4,
          name: "Сотрудники",
          route: "/employees",
          roles: ["Кадровый сотрудник"],
        },
        {
          id: 5,
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
      const userRole = await authorizationApi.getUserRole();
      this.menuItems = this.menuItems.filter(
        (item) => !item.roles || item.roles.includes(userRole.roleName)
      );
    },
    logOut() {
      this.logOutDialog = true;
    },
  },
};
</script>

<style scoped>
.sidebar-title {
  font-size: 20px;
  font-weight: bold;
  color: white;
}
</style>
