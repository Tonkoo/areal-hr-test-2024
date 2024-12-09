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
  getHistoryEmployees(id) {
    return api
      .get(`/employees/history/${id}`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          return response.data;
        } else {
          throw new Error("Expected an array but got: " + response.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching history employees:", err);
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
  addEmployee(employee, files) {
    console.log(files);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append(`files`, file);
    });
    formData.append("last_name", employee.last_name);
    formData.append("first_name", employee.first_name);
    formData.append("middle_name", employee.middle_name);
    formData.append("date_of_birth", employee.date_of_birth);
    formData.append("passport_series", employee.passport_series);
    formData.append("passport_number", employee.passport_number);
    formData.append("region_id", employee.region_id);
    formData.append("city_id", employee.city_id);
    formData.append("street", employee.street);
    formData.append("house", employee.house);
    formData.append("building", employee.building);
    formData.append("apartment", employee.apartment);
    formData.append("department_id", employee.department_id);
    formData.append("position_id", employee.position_id);
    formData.append("salary", employee.salary);

    return api
      .post("/employees", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
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
    const formData = new FormData();
    formData.append("file", file);
    formData.append("last_name", Employee.last_name);
    formData.append("first_name", Employee.first_name);
    formData.append("middle_name", Employee.middle_name);
    console.log(formData);

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
  downloadFile(fileId) {
    console.log(fileId);

    return api.get(`/files/download/${fileId}`, {
      responseType: "blob",
    });
  },
};
