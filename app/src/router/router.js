import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../components/Home.vue";
import Organizations from "../components/Organizations.vue";
import Departments from "../components/Departments.vue";
import Positions from "../components/Positions.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/organizations", component: Organizations },
  { path: "/departments", component: Departments },
  { path: "/positions", component: Positions },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
