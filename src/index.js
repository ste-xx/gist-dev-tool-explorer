import Vue from 'vue';
import vuetify from './plugins/vuetify.ts'
import App from './App.vue';

const app = new Vue({
  el: '#app',
  render: h => h(App),
  vuetify,
}).$mount('#app');
