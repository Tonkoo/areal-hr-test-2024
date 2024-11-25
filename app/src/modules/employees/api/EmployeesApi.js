import api from "@/shared/api/axios";

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
        if (err.response && err.response.status === 400) {
          throw err.response.data.errors;
        }
        console.error("Error saving employee:", err);
        throw err;
      });
  },
  updateEmployee(id, employee) {
    delete employee.id;
    return api
      .put(`/employees/${id}`, employee)
      .then(() => id)
      .catch((err) => {
        if (err.response && err.response.status === 400) {
          throw err.response.data.errors;
        }
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
  uploadEmployeeFile(Employee, file) {
    console.log(Employee);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("last_name", Employee.last_name);
    formData.append("first_name", Employee.first_name);
    formData.append("middle_name", Employee.middle_name);
    return api
      .post(`/files/${Employee.id}`, formData, {
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
