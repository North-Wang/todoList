/* 儲存帳戶重要資訊，不放在sessionStorage讓用戶可更改 */
import { defineStore } from "pinia";

export const useAccountInfo = defineStore({
  id: "placeData",
  state: () => {
    return {
      allPlaceData: {},
    };
  },
  actions: {},
  // persist: true, //true時能將資料存到sessionStorage。為了解決重新整理時state會被初始化
});
