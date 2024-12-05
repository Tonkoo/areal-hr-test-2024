<template>
  <v-dialog
    :model-value="dialog"
    @update:model-value="$emit('update:dialog', $event)"
    max-width="1000px"
  >
  </v-dialog>
</template>

<script>
import OrganizationsApi from "@/modules/organizations/api/organizations-api";

export default {
  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
    isEditMode: {
      type: Boolean,
      required: true,
    },
    organization: {
      type: Object,
      required: true,
    },
  },
  emits: ["update:dialog", "save"],
  data() {
    return {
      localOrganization: { ...this.organization },
      errors: {},
    };
  },
  watch: {
    organization: {
      handler(newOrganization) {
        this.localOrganization = { ...newOrganization };
      },
      deep: true,
    },
  },
  methods: {
    closeDialog() {
      this.errors = [];
      this.$emit("update:dialog", false);
    },
    saveOrganization() {
      if (this.isEditMode) {
        this.updateOrganization();
      } else {
        this.addOrganization();
      }
    },
    addOrganization() {
      OrganizationsApi.addOrganization({
        name: this.localOrganization.name,
        comment: this.localOrganization.comment,
      })
        .then(() => {
          this.errors = [];
          this.$emit("update:dialog", false);
          this.$emit("save");
        })
        .catch((err) => {
          this.errors = err;
          console.error("Error adding organization:", err);
        });
    },
    updateOrganization() {
      OrganizationsApi.updateOrganization(this.localOrganization.id, {
        name: this.localOrganization.name,
        comment: this.localOrganization.comment,
      })
        .then(() => {
          this.errors = [];
          this.$emit("update:dialog", false);
          this.$emit("save");
        })
        .catch((err) => {
          this.errors = err;
          console.error("Error updating organization:", err);
        });
    },
  },
};
</script>
