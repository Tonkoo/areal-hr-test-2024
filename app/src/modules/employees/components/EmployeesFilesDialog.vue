<template>
  <v-dialog
    :model-value="filesDialog"
    @update:model-value="$emit('update:filesDialog', $event)"
    max-width="600px"
  >
    <v-card>
      <v-card-title class="text-h5 bg-primary">
        <span class="white--text">Файлы сотрудника</span>
      </v-card-title>

      <v-card-text class="pt-4">
        <div v-if="employeeFiles.length > 0">
          <v-list>
            <v-list-item v-for="file in employeeFiles" :key="file.file_id">
              <div class="d-flex align-center justify-space-between">
                <v-list-item-title class="text-subtitle-1">
                  {{ file.file_name }}
                </v-list-item-title>
                <v-btn icon small color="error" @click="deleteFile(file)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </div>
            </v-list-item>
          </v-list>
        </div>
        <v-alert v-else type="info" text class="mb-4">
          У сотрудника пока нет загруженных файлов
        </v-alert>
        <v-file-input
          v-model="newFile"
          show-size
          truncate-length="25"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          label="Выберите файл для загрузки"
          prepend-icon="mdi-paperclip"
          @change="uploadFile"
          class="mt-2"
        >
        </v-file-input>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="closeDialog"> Закрыть </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import EmployeesApi from "../api/EmployeesApi";

export default {
  props: {
    filesDialog: {
      type: Boolean,
      required: true,
    },
    TableEmployees: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      newFile: null,
      employeeFiles: [],
    };
  },
  emits: ["update:filesDialog"],
  watch: {
    filesDialog(newVal) {
      if (newVal) {
        this.fetchEmployeeFiles();
      }
    },
  },
  methods: {
    closeDialog() {
      this.$emit("update:filesDialog", false);
    },
    fetchEmployeeFiles() {
      EmployeesApi.getEmployeeFiles(this.TableEmployees.id)
        .then((data) => {
          this.employeeFiles = data;
        })
        .catch((error) =>
          console.error("Error fetching employee files:", error)
        );
    },
    uploadFile() {
      EmployeesApi.uploadEmployeeFile(this.TableEmployees, this.newFile)
        .then(() => {
          this.fetchEmployeeFiles();
          this.newFile = null;
        })
        .catch((error) => console.error("Error uploading file:", error));
    },
    deleteFile(file) {
      EmployeesApi.deleteEmployeeFile(file.file_id, file.filepath)
        .then(() => {
          this.fetchEmployeeFiles();
        })
        .catch((error) => console.error("Error deleting file:", error));
    },
  },
};
</script>
