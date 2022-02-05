import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Card from './components/ui/Card.vue';
import BaseButton from './components/ui/BaseButton.vue';
import BaseDialog from './components/ui/BaseDialog.vue';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

import { io,  Socket }  from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents} from 'shared/models/socket-events'

const app = createApp(App);

app.config.globalProperties.$socketapp = io("http://localhost:3000/app",{
		autoConnect:false,
		withCredentials: true,
	}) as Socket<ServerToClientEvents, ClientToServerEvents>;

app.config.globalProperties.$pongSocket = io("http://localhost:3000/pong",{
	autoConnect:false,
	withCredentials: true,
});

declare module '@vue/runtime-core'{
	interface ComponentCustomProperties {
		$socketapp: Socket<ServerToClientEvents, ClientToServerEvents>
	}
}

app.use(store);
app.use(router);
app.component('card', Card);
app.component('base-button', BaseButton);
app.component('base-dialog', BaseDialog);

app.mount("#app");