import api from "@/api/axios";

export default {
  getDepartments() {
    return api
      .get("/departments")
      .then((response) => {
        if (Array.isArray(response.data)) {
          return response.data;
        } else {
          throw new Error("Expected an array but got: " + response.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching departments:", err);
        throw err;
      });
  },
  addDepartment(department) {
    return api
      .post("/departments", department)
      .then((response) => response.data)
      .catch((err) => {
        console.error("Error adding department:", err);
        throw err;
      });
  },
  updateDepartment(id, department) {
    return api
      .put(`/departments/${id}`, department)
      .then(() => id)
      .catch((err) => {
        console.error("Error updating department:", err);
        throw err;
      });
  },
  deleteDepartment(id) {
    return api
      .delete(`/departments/${id}`)
      .then(() => id)
      .catch((err) => {
        console.error("Error deleting department:", err);
        throw err;
      });
  },
};
