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
  getHistoryUsers(id) {
    return api
      .get(`/users/history/${id}`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          return response.data;
        } else {
          throw new Error("Expected an array but got: " + response.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching history users:", err);
        throw err;
      });
  },
  addUser(user) {
    return api
      .post("/users", user)
      .then((response) => response.data)
      .catch((err) => {
        if (err.response && err.response.status === 400) {
          throw err.response.data.errors;
        }
        console.error("Error saving user:", err);
        throw err;
      });
  },
  updateUser(id, user, resetPassword) {
    return api
      .put(`/users/${id}?isResetPassword=${resetPassword}`, user)
      .then(() => id)
      .catch((err) => {
        if (err.response && err.response.status === 400) {
          throw err.response.data.errors;
        }
        console.error("Error updating user:", err);
        throw err;
      });
  },
  deleteUser(id) {
    return api
      .delete(`/users/${id}`)
      .then(() => id)
      .catch((err) => {
        console.error("Error deleting user:", err);
        throw err;
      });
  },
  updateRoleUser(id) {
    return api
      .put(`/users/role/${id}`)
      .then(() => id)
      .catch((err) => {
        console.error("Error updating user:", err);
        throw err;
      });
  },
};
