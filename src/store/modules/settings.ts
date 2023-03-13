import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('app-settings', {
  state: () => ({
    permissionData: [],
    currentSysId: '',
  }),
  getters: {},
  actions: {
    setPermission(data: any) {
      this.permissionData = data;
    },
    setSysId(data: any) {
      this.currentSysId = data;
    },
  },
});
