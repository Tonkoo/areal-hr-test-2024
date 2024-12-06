import { defineStore } from "pinia";

export const useAuthStore = defineStore("authStore", {
  state: () => ({ isAuthenticated: false }),
  actions: {
    toggleAuthStatus() {
      this.isAuthenticated = !this.isAuthenticated;
    },
  },
  persist: true,
});
