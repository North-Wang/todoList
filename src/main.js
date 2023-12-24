import { createApp } from "vue";

//pinia
import { createPinia, storeToRefs } from "pinia";
const pinia = createPinia();
pinia.use(
  createPersistedState({
    storage: sessionStorage, //設定Pinia檔persist為true時，默認資料儲存的位置
  })
);
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { createPersistedState } from "pinia-plugin-persistedstate";

//ccs
import "./style.css";
import "animate.css";

import App from "./App.vue";
import router from "./router";

// Vue.config.productionTip = false; //禁止開發模式的提示
const app = createApp(App);

app.config.errorHandler = (err) => {
  console.error("捕抓到錯誤訊息", err);
};

app.use(pinia).use(router).mount("#app");
