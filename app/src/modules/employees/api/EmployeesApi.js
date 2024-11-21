import api from "@/api/axios";

export default {
  getEmployees() {
    return api
      .get("/employees")
      .then((response) => response.data)
      .catch((err) => {
        console.error("Error fetching employees:", err);
        throw err;
      });
  },
  getRegions() {
    return api
      .get("/regions")
      .then((response) => response.data)
      .catch((err) => {
        console.error("Error fetching regions:", err);
        throw err;
      });
  },
  getCities() {
    return api
      .get("/citys")
      .then((response) => response.data)
      .catch((err) => {
        console.error("Error fetching cities:", err);
        throw err;
      });
  },
  addEmployee(employee) {
    return api
      .post("/employees", employee)
      .then((response) => response.data)
      .catch((err) => {
        console.error("Error adding employee:", err);
        throw err;
      });
  },
  updateEmployee(id, employee) {
    return api
      .put(`/employees/${id}`, employee)
      .then(() => id)
      .catch((err) => {
        console.error("Error updating employee:", err);
        throw err;
      });
  },
  dismissEmployee(id) {
    return api
      .post(`/employees/${id}`)
      .then(() => id)
      .catch((err) => {
        console.error("Error dismissing employee:", err);
        throw err;
      });
  },
  getEmployeeFiles(employeeId) {
    return api
      .get(`/files/${employeeId}`)
      .then((response) => response.data)
      .catch((err) => {
        console.error("Error fetching employee files:", err);
        throw err;
      });
  },
  uploadEmployeeFile(employeeId, file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", file.name);

    return api
      .post(`/files/${employeeId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => response.data)
      .catch((err) => {
        console.error("Error uploading employee file:", err);
        throw err;
      });
  },
  deleteEmployeeFile(fileId, filepath) {
    return api
      .delete(`/files/${fileId}`, {
        params: { filepath },
      })
      .then(() => fileId)
      .catch((err) => {
        console.error("Error deleting employee file:", err);
        throw err;
      });
  },
};