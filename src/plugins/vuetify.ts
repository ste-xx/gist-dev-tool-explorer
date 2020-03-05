import '@fortawesome/fontawesome-free/js/all.js' // Ensure you are using css-loader

import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify);

const opts = {
  theme: {
    dark: window.matchMedia('(prefers-color-scheme: dark)').matches
  },
  icons: {
    iconfont: 'fa'
  }
};

// @ts-ignore
export default new Vuetify(opts);
