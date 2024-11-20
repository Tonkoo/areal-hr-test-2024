import api from "@/api/axios";

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
        console.error("Error fetching organizations:", err);
        throw err;
      });
  },
  addOrganization(organization) {
    return api
      .post("/organizations", organization)
      .then((response) => response.data)
      .catch((err) => {
        console.error("Error saving organization:", err);
        throw err;
      });
  },
  updateOrganization(id, organization) {
    return api
      .put(`/organizations/${id}`, organization)
      .then(() => id)
      .catch((err) => {
        console.error("Error updating organization:", err);
        throw err;
      });
  },
  deleteOrganization(id) {
    return api
      .delete(`/organizations/${id}`)
      .then(() => id)
      .catch((err) => {
        console.error("Error deleting organization:", err);
        throw err;
      });
  }
};
