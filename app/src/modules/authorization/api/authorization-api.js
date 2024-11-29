import api from "@/shared/api/axios";

export default {
  logIn(user) {
    return api
      .post("/login", user)
      .then((response) => {
        console.log("Успешный вход:", response.data);
      })
      .catch((err) => {
        console.error("Ошибка авторизации:", err);
      });
  },
};
