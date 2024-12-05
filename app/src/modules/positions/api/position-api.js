import api from "@/shared/api/axios";

export default {
  getPosition() {
    return api
      .get("/positions")
      .then((response) => {
        if (Array.isArray(response.data)) {
          return response.data;
        } else {
          throw new Error("Expected an array but got: " + response.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching positions:", err);
        throw err;
      });
  },
  addPosition(position) {
    return api
      .post("/positions", position)
      .then((response) => response.data)
      .catch((err) => {
        if (err.response && err.response.status === 400) {
          throw err.response.data.errors;
        }
        console.error("Error saving position:", err);
        throw err;
      });
  },
  updatePosition(id, position) {
    return api
      .put(`/positions/${id}`, position)
      .then(() => id)
      .catch((err) => {
        if (err.response && err.response.status === 400) {
          throw err.response.data.errors;
        }
        console.error("Error updating position:", err);
        throw err;
      });
  },
  deletePosition(id) {
    return api
      .delete(`/positions/${id}`)
      .then(() => id)
      .catch((err) => {
        console.error("Error deleting position:", err);
        throw err;
      });
  },
};