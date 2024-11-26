import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/HomePage.vue";
import Organizations from "../pages/OrganizationsPage.vue";
import Departments from "../pages/DepartmentsPage.vue";
import Positions from "../pages/PositionsPage.vue";
import Employees from "../pages/EmployeesPage.vue";
import Users from "../pages/UsersPage.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/organizations", component: Organizations },
  { path: "/departments", component: Departments },
  { path: "/positions", component: Positions },
  { path: "/employees", component: Employees },
  { path: "/users", component: Users },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
