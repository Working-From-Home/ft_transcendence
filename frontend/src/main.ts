import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import '@/assets/scss/custom.scss';
import '@/assets/scss/global.scss';

import { io }  from "socket.io-client";
import http from "@/http";
import socketApp from "./socketApp";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { createPinia } from 'pinia'

const app = createApp(App);

app.config.globalProperties.$http = http; // this is axios
app.config.globalProperties.$socketapp = socketApp;
app.config.globalProperties.$pongSocket = io( process.env.VUE_APP_BACKEND_SERVER_URI + "/pong",{
	autoConnect:false,
	withCredentials: true,
});

app
  .use(createPinia()) 
  .use(router)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app');
