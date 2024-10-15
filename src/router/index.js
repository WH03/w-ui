import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "graph",
    meta: { title: "绘制图形" },
    component: () => import("../views/graph/index.vue"),
  },
  {
    path: "/graph",
    name: "graph",
    meta: { title: "绘制图形" },
    component: () => import("../views/graph/index.vue"),
  },

  {
    path: "/model",
    name: "model",
    meta: { title: "引入模型" },
    component: () => import("../views/model/index.vue"),
  },
];

const router = createRouter({
  mode: history,
  // base:process.env.BASE_URL,
  history: createWebHistory(),
  routes,
});

export default router;
