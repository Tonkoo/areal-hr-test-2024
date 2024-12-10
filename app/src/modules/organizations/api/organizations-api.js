import api from "@/shared/api/axios";
import { useAuthStore } from "@/stores/use-auth-store";

export default {
  getOrganizations() {
    return api
      .get("/organizations")
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
        console.error("Error fetching organizations:", err);
        throw err;
      });
  },
  getHistoryOrganizations(id) {
    return api
      .get(`/organizations/history/${id}`)
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
        console.error("Error fetching history organizations:", err);
        throw err;
      });
  },
  addOrganization(organization) {
    return api
      .post("/organizations", organization)
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
        console.error("Error saving organization:", err);
        throw err;
      });
  },
  updateOrganization(id, organization) {
    return api
      .put(`/organizations/${id}`, organization)
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
        console.error("Error updating organization:", err);
        throw err;
      });
  },
  deleteOrganization(id) {
    return api
      .delete(`/organizations/${id}`)
      .then(() => id)
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          const authStore = useAuthStore();
          authStore.disableAuthentication();
          window.location.reload();
        }
        console.error("Error deleting organization:", err);
        throw err;
      });
  },
};
