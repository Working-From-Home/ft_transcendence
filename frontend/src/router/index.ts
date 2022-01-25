import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import store from "../store";
import PongMatchmaking from '../components/pong/PongMatchmaking.vue'
import PongGame from '../components/pong/PongGame.vue'
import PongWelcome from '../components/pong/PongWelcome.vue'

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
			children: [{
				path:'matchmaking',
				component: PongMatchmaking
			},
			{
				path:':gameId',
				component: PongGame,
			},
			{
				path: '',
				component: PongWelcome
			}
			]
  },
  {
    path: "/chat",
    name: "Chat",
	meta: { requiresAuth: true },
    component: () =>
      import("../views/Chat.vue"),
  },
  {
    path: "/profile",
    name: "profile",
	meta: { requiresAuth: true },
    component: () =>
      import("../views/profiles/Profile.vue"),
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
