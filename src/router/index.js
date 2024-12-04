import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/customLayer",
    name: "customLayer",
    meta: { title: "自定义图层" },
    component: () => import("../views/customLayer/index.vue"),
  },
  {
    path: "/coordinate",
    name: "coordinate",
    meta: { title: "坐标转换" },
    component: () => import("../views/coordinate/index.vue"),
  },
  {
    path: "/camera",
    name: "camera",
    meta: { title: "相机" },
    component: () => import("../views/camera/index.vue"),
  }, {
    path: "/flyTo",
    name: "flyTo",
    meta: { title: "飞行动画" },
    component: () => import("../views/flyTo/index.vue"),
  },
  {
    path: "/popover",
    name: "popover",
    meta: { title: "弹出框" },
    component: () => import("../views/popover/index.vue"),
  },
  {
    path: "/",
    name: "graph",
    meta: { title: "绘制图形" },
    component: () => import("../views/graph/index.vue"),
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
  }, {
    path: "/flowingLine",
    name: "flowingLine",
    meta: { title: "增长的线" },
    component: () => import("../views/flowingLine/index.vue"),
  },

  {
    path: "/model",
    name: "model",
    meta: { title: "引入模型" },
    component: () => import("../views/model/index.vue"),
  },
  {
    path: "/draw",
    name: "draw",
    meta: { title: "画图" },
    component: () => import("../views/draw/index.vue"),
  },
];

const router = createRouter({
  mode: history,
  // base:process.env.BASE_URL,
  history: createWebHistory(),
  routes,
});

export default router;
