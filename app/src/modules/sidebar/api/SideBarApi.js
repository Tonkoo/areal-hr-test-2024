import api from "../../../shared/api/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import router from "@/router/router";

export default {
  getUserRole() {
    return api
      .get("/user-role")
      .then((response) => {
        if (response.data && response.data.roleName) {
          return response.data.roleName;
        } else {
          throw new Error(
            "Expected roleName but got: " + JSON.stringify(response.data)
          );
        }
      })
      .catch((err) => {
        const authStore = useAuthStore();
        authStore.toggleAuthStatus();
        router.push("/");
        console.error("Error fetching user role:", err);
      });
  },
  logOut() {
    return api
      .post("/logout")
      .then((response) => {
        console.log(response.data.message);
        const authStore = useAuthStore();
        authStore.toggleAuthStatus();
        router.push("/");
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  },
};
