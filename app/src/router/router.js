import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/use-auth-store";
import AuthorizationPage from "../pages/authorization-page.vue";
import Home from "../pages/home-page.vue";
import Organizations from "../pages/organizations-page.vue";
import Departments from "../pages/departments-page.vue";
import Positions from "../pages/positions-page.vue";
import Employees from "../pages/employees-page.vue";
import Users from "../pages/users-page.vue";

const routes = [
  { path: "/", component: AuthorizationPage },
  { path: "/home", component: Home },
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

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (!authStore.isAuthenticated && to.path !== "/") {
    next("/");
  } else if (authStore.isAuthenticated && to.path === "/") {
    next("/home");
  } else {
    next();
  }
});

export default router;
