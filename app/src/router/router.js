import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../components/Home.vue";
import Organizations from "../components/Organizations.vue";
import Departments from "../components/Departments.vue";
import Positions from "../components/Positions.vue";
import Employees from "../components/Employees.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/organizations", component: Organizations },
  { path: "/departments", component: Departments },
  { path: "/positions", component: Positions },
  { path: "/employees", component: Employees },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
