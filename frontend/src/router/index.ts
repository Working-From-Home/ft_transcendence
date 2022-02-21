import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import PongGame from '../components/pong/PongGame.vue'
import PongHome from '../components/pong/PongHome.vue'
import { useAuthStore } from "@/store/modules/auth/auth";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: 'Home'
    }
  },
  {
    path: "/pong",
    name: "Pong",
		meta: {
      title: 'Pong',
      requiresAuth: true
    },
    component: () =>
      import("../views/Pong.vue"),
			children: [
			{
				path:':gameId',
				component: PongGame,
			},
			{
				path: '',
				component: PongHome
			}
			]
  },
  {
    path: "/chat",
    name: "Chat",
	  meta: {
      title: 'Chat',
      requiresAuth: true
    },
    component: () =>
      import("../views/Chat.vue"),
  },
  {
    path: "/profile",
    name: "profile",
  	meta: {
      title: 'Profile',
      requiresAuth: true
    },
    component: () =>
      import("../views/profiles/Profile.vue"),
  },
  {
    path: "/auth/signup",
    name: "Register",
	  meta: {
      title: 'Sign up',
      requiresUnAuth: true
    },
    component: () =>
      import("../views/auth/signUp.vue"),
  },
  {
    path: "/auth/signin",
    name: "Log",
	  meta: {
      title: 'Sign in',
      requiresUnAuth: true
    },
    component: () =>
      import("../views/auth/signIn.vue"),
  },
  {
    path: "/admin",
    name: "admin",
	  meta: {
      title: 'Administration',
      requiresAuth: true
    },
    component: () =>
      import("../views/AdminPannel.vue"),
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
  const authStore = useAuthStore();
  document.title = `Ft_transcendence - ${to.meta.title}`;
  if (to.meta.requiresAuth && !authStore.isLoggedIn)
		next('/');
	else if (to.meta.requiresUnAuth && authStore.isLoggedIn)
		next('/');
	else
		next();
});

export default router;
