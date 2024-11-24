<script>
export default {
  data() {
    return {
      drawer: true,
      menuItems: [
        { id: 1, name: "Главная", route: "/" },
        { id: 2, name: "Организации", route: "/organizations" },
        { id: 3, name: "Отделы", route: "/departments" },
        { id: 4, name: "Должности", route: "/positions" },
        { id: 5, name: "Сотрудники", route: "/employees" },
        // { id: 6, name: "Кадровые операции", route: "/operations" },
      ],
    };
  },
};
</script>

<template>
  <v-navigation-drawer app v-model="drawer" permanent>
    <v-list-item class="sidebar-header">
      <v-list-item-title class="sidebar-title">HR отдел</v-list-item-title>
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
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
.sidebar-header {
  background-color: #1976d2;
  color: white;
  padding: 16px;
  display: flex;
  align-items: center;
}

.sidebar-title {
  font-size: 20px;
  font-weight: bold;
  color: white;
}
</style>
