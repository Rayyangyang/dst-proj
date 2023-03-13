import { defineStore } from 'pinia';

export const useReloadPage = defineStore({
  id: 'reload-page',
  state: () => ({
    contractPageReload: '',
    linePageReload: '',
    orderListPageReload: '',
  }),
  getters: {
    // getAddresInfo() {
    //   return this.sendAddresInfo;
    // },
  },
  actions: {
    setContractPageReload() {
      this.contractPageReload = new Date();
    },
    setLinePageReload() {
      this.linePageReload = new Date();
    },
    setOrderListPageReload() {
      this.orderListPageReload = new Date();
    },
  },
});
