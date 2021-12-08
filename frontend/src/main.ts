import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Card from './components/ui/Card.vue';
import BaseButton from './components/ui/BaseButton.vue';
import BaseDialog from './components/ui/BaseDialog.vue';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

const app = createApp(App);

app.use(store);
app.use(router);
app.component('card', Card);
app.component('base-button', BaseButton);
app.component('base-dialog', BaseDialog);

app.mount("#app");
