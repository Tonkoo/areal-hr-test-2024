import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Organizations from "../pages/Organizations.vue";
import Departments from "../pages/Departments.vue";
import Positions from "../pages/Positions.vue";
import Employees from "../pages/Employees.vue";
import Operations from "../pages/Operations.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/organizations", component: Organizations },
  { path: "/departments", component: Departments },
  { path: "/positions", component: Positions },
  { path: "/employees", component: Employees },
  { path: "/operations", component: Operations },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
