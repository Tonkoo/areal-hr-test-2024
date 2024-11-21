import api from "@/shared/api/axios";

export default {
  getOperations() {
    return api
      .get("/operations")
      .then((response) => {
        if (Array.isArray(response.data)) {
          return response.data;
        } else {
          throw new Error("Expected an array but got: " + response.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching operations:", err);
        throw err;
      });
  },
};
