import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/use-auth-store";
import AuthorizationPage from "../pages/authorization-page.vue";
import Organizations from "../pages/organizations-page.vue";
import Departments from "../pages/departments-page.vue";
import Positions from "../pages/positions-page.vue";
import Employees from "../pages/employees-page.vue";
import Users from "../pages/users-page.vue";
import authorizationApi from "@/modules/authorization/api/authorization-api";

const routes = [
  { path: "/", component: AuthorizationPage },
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

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const checkrole = await authorizationApi.getUserRole();
  if (checkrole.session) {
    authStore.authenticateUser();
  }
  if (!authStore.isAuthenticated && to.path !== "/") {
    next("/");
  } else if (authStore.isAuthenticated && to.path === "/") {
    if (checkrole.roleName == "Кадровый сотрудник") next("/employees");
    if (checkrole.roleName == "Администратор") next("/users");
  } else {
    next();
  }
});

export default router;
