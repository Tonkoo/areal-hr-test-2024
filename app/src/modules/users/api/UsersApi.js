import api from "@/shared/api/axios";

export default {
  getUsers() {
    return api
      .get("/users")
      .then((response) => {
        if (Array.isArray(response.data)) return response.data;
        else throw new Error("Expected an array but got: " + response.data);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        throw err;
      });
  },
};
