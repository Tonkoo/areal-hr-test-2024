import api from "../axios";

export default {
  getUserRole() {
    return api
      .get("/user-role", { withCredentials: true })
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
        console.error("Error fetching user role:", err);
        throw err;
      });
  },
};
