import api from "@/shared/api/axios";

export default {
  getEmployees() {
    return api
      .get("/employees")
      .then((response) => response.data)
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.reload();
        }
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
        if (err.response && err.response.status === 401) {
          window.location.reload();
        }
        throw err;
      });
  },
  getRegions() {
    return api
      .get("/regions")
      .then((response) => response.data)
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.reload();
        }
        throw err;
      });
  },
  getCities() {
    return api
      .get("/citys")
      .then((response) => response.data)
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.reload();
        }
        throw err;
      });
  },
  addEmployee(employee, files) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append(`files`, file);
    });
    if (employee.last_name) formData.append("last_name", employee.last_name);
    if (employee.first_name) formData.append("first_name", employee.first_name);
    if (employee.middle_name)
      formData.append("middle_name", employee.middle_name);
    if (employee.date_of_birth)
      formData.append("date_of_birth", employee.date_of_birth);
    if (employee.passport_series)
      formData.append("passport_series", employee.passport_series);
    if (employee.passport_number)
      formData.append("passport_number", employee.passport_number);
    if (employee.region_id) formData.append("region_id", employee.region_id);
    if (employee.city_id) formData.append("city_id", employee.city_id);
    if (employee.street) formData.append("street", employee.street);
    if (employee.house) formData.append("house", employee.house);
    if (employee.building) formData.append("building", employee.building);
    if (employee.apartment) formData.append("apartment", employee.apartment);
    if (employee.department_id)
      formData.append("department_id", employee.department_id);
    if (employee.position_id)
      formData.append("position_id", employee.position_id);
    if (employee.salary) formData.append("salary", employee.salary);

    return api
      .post("/employees", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
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
  updateEmployee(id, employee) {
    delete employee.id;
    return api
      .put(`/employees/${id}`, employee)
      .then(() => id)
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
  dismissEmployee(id) {
    return api
      .post(`/employees/${id}`)
      .then(() => id)
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.reload();
        }
        throw err;
      });
  },
  getEmployeeFiles(employeeId) {
    return api
      .get(`/files/${employeeId}`)
      .then((response) => response.data)
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.reload();
        }
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
        if (err.response && err.response.status === 401) {
          window.location.reload();
        }
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
        if (err.response && err.response.status === 401) {
          window.location.reload();
        }
        throw err;
      });
  },
  downloadFile(fileId) {
    return api.get(`/files/download/${fileId}`, {
      responseType: "blob",
    });
  },
};
