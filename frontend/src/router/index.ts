import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import PongGame from '../components/pong/PongGame.vue'
import PongHome from '../components/pong/PongHome.vue'
import Auth from "@/views/auth/Auth.vue";
import { useAuthStore } from "@/store/auth";
import { AuthMode } from "@/views/auth/auth.interface";
import Profile from "@/views/Profile.vue"
import OauthWait from "@/components/auth/OauthWait.vue";

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
    name: "profile",
    path: "/users/:userid",
    meta: {
      title: 'Profile',
      requiresAuth: true
    },
    component: Profile,
  },
  {
    name: 'signup',
    path: '/signup',
    alias: ['/sign-up', '/register'],
	  meta: {
      title: 'Register',
      requiresUnAuth: true
    },
    component: Auth,
    props: { selectForm: AuthMode.Register}
  },
  {
    name: 'signin',
    path: '/signin',
    alias: ['/sign-in', '/login'],
	  meta: {
      title: 'Login',
      requiresUnAuth: true
    },
    component: Auth,
    props: { selectForm: AuthMode.Login}
  },
  {
    name: 'oauth',
    path: '/signup/oauth',
	  meta: {
      title: 'Login',
      requiresUnAuth: true
    },
    component: OauthWait,
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

router.beforeEach(function(to, from, next) {
	//take care of closing modal porperly on route change.
	let modalBackground = document.querySelector('.modal-backdrop')
	if (modalBackground) {
		modalBackground.remove()
	}

  const authStore = useAuthStore();
  document.title = `Transcendence - ${to.meta.title}`;
  if (to.meta.requiresAuth && !authStore.isLoggedIn)
    next('/');
  else if (to.meta.requiresUnAuth && authStore.isLoggedIn)
		next('/');
  else if (authStore.registerInProgress && to.name != 'signup')
      next({name: 'signup'});
  else
    next();
});

export default router;
