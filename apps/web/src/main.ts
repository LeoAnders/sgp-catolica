import { createApp } from 'vue';
import '@sgp/design-tokens/tokens.css';
import { vuetify } from './plugins/vuetify';
import './styles/global.css';
import App from './App.vue';

createApp(App).use(vuetify).mount('#app');
