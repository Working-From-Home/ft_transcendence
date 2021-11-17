import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/pong",
    name: "Pong",
    component: () =>
      import("../views/Pong.vue"),
  },
  {
    path: "/chat",
    name: "Chat",
    component: () =>
      import("../views/Chat.vue"),
  },
  {
    path: "/log",
    name: "Log",
    component: () =>
      import("../views/log/Log.vue"),
  },
  { 
	path: '/:notFound(.*)',
	component: () =>
      import("../views/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
