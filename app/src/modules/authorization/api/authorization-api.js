import api from "@/shared/api/axios";
import router from "@/router/router";
import { useAuthStore } from "@/stores/useAuthStore";

export default {
  logIn(user) {
    const authStore = useAuthStore();
    return api
      .post("/login", user)
      .then((response) => {
        console.log("Успешный вход:", response.data);
        authStore.toggleAuthStatus();
        router.push("/home");
      })
      .catch((err) => {
        console.error("Authorization error:", err);
        throw err;
      });
  },
};
