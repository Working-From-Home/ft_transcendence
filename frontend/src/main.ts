import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Card from './components/ui/Card.vue';

const app = createApp(App);

app.use(store)
app.use(router)
app.component('card', Card)

app.mount("#app");
