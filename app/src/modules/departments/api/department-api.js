import api from "@/shared/api/axios";

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
        if (err.response && err.response.status === 401) {
          window.location.reload();
        }
        throw err;
      });
  },
  getHistoryDepartments(id) {
    return api
      .get(`/departments/history/${id}`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          return response.data;
        } else {
          throw new Error("Expected an array but got: " + response.data);
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.reload();
        }
        throw err;
      });
  },
  addDepartment(department) {
    return api
      .post("/departments", department)
      .then((response) => response.data)
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.reload();
        }
        if (err.response && err.response.status === 400) {
          throw err.response;
        }
        throw err;
      });
  },
  updateDepartment(id, department) {
    return api
      .put(`/departments/${id}`, department)
      .then((response) => response.data)
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.reload();
        }
        if (err.response && err.response.status === 400) {
          throw err.response;
        }
        throw err;
      });
  },
  deleteDepartment(id) {
    return api
      .delete(`/departments/${id}`)
      .then(() => id)
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.reload();
        }
        throw err;
      });
  },
};
