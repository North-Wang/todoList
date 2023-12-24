import { createRouter, createWebHashHistory } from "vue-router";
import Homepage from "../components/Homepage.vue"

const router = createRouter({
  history: createWebHashHistory(), //如果填入"/object"，這樣進去每個分頁的前面都會有/object
  scrollBehavior(to, from, savedPosition) {
    //進到頁面都會回到頂端
    return { top: 0, behavior: "smooth" };
  },
  routes: [
    {
      //找不到網頁時，導回首頁
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      redirect: { name: "home", component: Homepage },
    },
    {
      path: "/",
      name: "home",
      component: Homepage,
    },
  ],
});

/* 前置守衛 */
router.beforeEach((to, from) => {
  // ...
  // 返回 false 以取消导航
  // return false
  return true;
});

export default router;
