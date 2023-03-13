
import { defineStore } from 'pinia';

export const useOrderStore = defineStore({
  id: 'app-order',
  state: (): OrderState => ({
    sendAddresInfo: {
      address: '',
      longitude: '',
      latitude: '',
      sendCityCode: '',
    },
    receiveAddresInfo: {
      address: '',
      longitude: '',
      latitude: '',
      receiveCityCode: '',
    },
  }),
  getters: {
    getAddresInfo() {
      return this.sendAddresInfo;
    },
  },
  actions: {
    setAddressInfo(info) {
      this.sendAddresInfo = info;
    },
    setreceiveAddressInfo(info) {
      this.receiveAddresInfo = info;
    },
  },
});
