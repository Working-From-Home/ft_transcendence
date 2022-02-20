import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store, { key } from "./store";
import Card from './components/ui/Card.vue';
import BaseButton from './components/ui/BaseButton.vue';
import BaseDialog from './components/ui/BaseDialog.vue';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

import { io,  Socket }  from "socket.io-client";
import http from "@/http";
import socketApp from "./socketApp";
import { Store } from "vuex";
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
// .provide("$store", store)
.use(store, key) // useful ?
  .use(createPinia()) 
  .use(router)
  .component('card', Card)
  .component('base-button', BaseButton)
  .component('base-dialog', BaseDialog)
  .component('font-awesome-icon', FontAwesomeIcon)
	.mount('#app');
