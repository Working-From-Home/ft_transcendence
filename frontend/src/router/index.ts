import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import store from "../store";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/pong",
    name: "Pong",
	meta: { requiresAuth: true },
    component: () =>
      import("../views/Pong.vue"),
  },
  {
    path: "/chat",
    name: "Chat",
	meta: { requiresAuth: true },
    component: () =>
      import("../views/Chat.vue"),
  },
  {
    path: "/auth/signup",
    name: "Register",
	meta: { requiresUnAuth: true },
    component: () =>
      import("../views/auth/signUp.vue"),
  },
  {
    path: "/auth/signin",
    name: "Log",
	meta: { requiresUnAuth: true },
    component: () =>
      import("../views/auth/signIn.vue"),
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

router.beforeEach(function(to, _, next) {
	if (to.meta.requiresAuth && !store.getters.isAuth)
		next('/');
	else if (to.meta.requiresUnAuth && store.getters.isAuth)
		next('/');
	else
		next();
});

export default router;
