import { createApp } from 'vue';
import router from './router';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { MaskInput } from 'vue-3-mask';

const app = createApp(App);
app.component('MaskInput', MaskInput);
app.use(router);
app.mount('#app');
