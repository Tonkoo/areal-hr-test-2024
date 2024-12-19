<template>
  <v-snackbar
    :model-value="snackbar"
    @update:model-value="$emit('update:snackbar', $event)"
    :timeout="timeout"
    :color="color"
  >
    <v-icon left v-if="error">mdi-alert-circle</v-icon>
    <v-icon left v-if="!error">mdi-check-circle</v-icon>
    {{ text }}
  </v-snackbar>
</template>

<script>
export default {
  props: {
    snackbar: {
      type: Boolean,
      required: true,
    },
    settingsSnackBar: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      timeout: 2000,
      icon: "mdi-alert-circle",
      color: "",
      text: "",
      error: false,
    };
  },
  watch: {
    settingsSnackBar: {
      handler(newSettings) {
        this.color = newSettings.error ? "red" : "green";
        this.text = newSettings.text;
        this.error = newSettings.error;
      },
      deep: true,
    },
  },
  emits: ["update:snackbar"],
};
</script>

<style></style>
