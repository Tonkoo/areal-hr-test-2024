import api from "@/shared/api/axios";
import { useAuthStore } from "@/stores/use-auth-store";

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
          const authStore = useAuthStore();
          authStore.disableAuthentication();
          window.location.reload();
        }
        console.error("Error fetching departments:", err);
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
          const authStore = useAuthStore();
          authStore.disableAuthentication();
          window.location.reload();
        }
        console.error("Error fetching history departments:", err);
        throw err;
      });
  },
  addDepartment(department) {
    return api
      .post("/departments", department)
      .then((response) => response.data)
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          const authStore = useAuthStore();
          authStore.disableAuthentication();
          window.location.reload();
        }
        if (err.response && err.response.status === 400) {
          throw err.response.data.errors;
        }
        console.error("Error adding department:", err);
        throw err;
      });
  },
  updateDepartment(id, department) {
    return api
      .put(`/departments/${id}`, department)
      .then((response) => response.data)
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          const authStore = useAuthStore();
          authStore.disableAuthentication();
          window.location.reload();
        }
        if (err.response && err.response.status === 400) {
          throw err.response.data.errors;
        }
        console.error("Error updating department:", err);
        throw err;
      });
  },
  deleteDepartment(id) {
    return api
      .delete(`/departments/${id}`)
      .then(() => id)
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          const authStore = useAuthStore();
          authStore.disableAuthentication();
          window.location.reload();
        }
        console.error("Error deleting department:", err);
        throw err;
      });
  },
};
