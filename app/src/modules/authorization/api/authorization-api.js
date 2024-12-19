import api from "@/shared/api/axios";
import router from "@/router/router";
import { useAuthStore } from "@/stores/use-auth-store";

export default {
  logIn(user) {
    const authStore = useAuthStore();
    return api
      .post("/login", user)
      .then((response) => {
        console.log("Успешный вход:", response.data);
        authStore.authenticateUser();
        if (response.data.user.roleName == "Администратор")
          router.push("/users");
        if (response.data.user.roleName == "Кадровый сотрудник")
          router.push("/employees");
      })
      .catch((err) => {
        throw err;
      });
  },
  logOut() {
    return api
      .post("/logout")
      .then((response) => {
        console.log(response.data.message);
        window.location.reload();
      })
      .catch((err) => {
        throw err;
      });
  },
  getUserRole() {
    return api
      .get("/user-role")
      .then((response) => {
        return response.data;
      })
      .catch(() => {});
  },
  getUserFullName() {
    return api
      .get("/user-fullname")
      .then((response) => {
        if (response.data && response.data.fullname) {
          const authStore = useAuthStore();
          authStore.authenticateUser();
          return response.data.fullname;
        } else {
          throw new Error(
            "Expected fullname but got: " + JSON.stringify(response.data)
          );
        }
      })
      .catch(() => {
        window.location.reload();
      });
  },
};
