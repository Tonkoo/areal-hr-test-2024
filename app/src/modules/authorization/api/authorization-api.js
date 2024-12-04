import api from "@/shared/api/axios";
import router from "@/router/router";
import { useAuthStore } from "@/stores/useAuthStore";

export default {
  logIn(user) {
    const authStore = useAuthStore();
    return api
      .post("/login", user, { withCredentials: true })
      .then((response) => {
        console.log("Успешный вход:", response.data);
        console.log(response.data.user.roleName);

        authStore.toggleAuthStatus();
        router.push("/home");
      })
      .catch((err) => {
        console.error("Ошибка авторизации:", err);
        throw err;
      });
  },
};
