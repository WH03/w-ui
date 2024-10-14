import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home/index.vue";
// import About from "./views/About.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home/index.vue"),
    children: [
      {
        path: "/",
        name: "Home",
        component: () => import("../views/Home/index.vue"),
      },
    ],
  },
  //   {
  //     path: "/about",
  //     name: "About",
  //     component: About,
  //   },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
