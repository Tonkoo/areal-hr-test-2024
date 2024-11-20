import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../components/Home.vue";
import Organizations from "../pages/Organizations.vue";
import Departments from "../pages/Departments.vue";
import Positions from "../pages/Positions.vue";
import Employees from "../components/Employees.vue";
import Operations from "../components/Operations.vue";

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
