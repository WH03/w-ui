import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "graph",
    meta: { title: "绘制图形" },
    component: () => import("../views/graph/index.vue"),
  },
  {
    path: "/customLayer",
    name: "customLayer",
    meta: { title: "自定义图层" },
    component: () => import("../views/customLayer/index.vue"),
  },
  {
    path: "/borderHighLight",
    name: "borderHighLight",
    meta: { title: "描边高亮" },
    component: () => import("../views/borderHighLight/index.vue"),
  },

  {
    path: "/graph",
    name: "graph",
    meta: { title: "绘制图形" },
    component: () => import("../views/graph/index.vue"),
  },
  {
    path: "/billboard",
    name: "billboard",
    meta: { title: "添加标记" },
    component: () => import("../views/billboard/index.vue"),
  },
  {
    path: "/visualData",
    name: "visualData",
    meta: { title: "数据可视化" },
    component: () => import("../views/visualData/index.vue"),
  },

  {
    path: "/model",
    name: "model",
    meta: { title: "引入模型" },
    component: () => import("../views/model/index.vue"),
  },
  {
    path: "/222",
    name: "3333",
    meta: { title: "asdadas" },
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
