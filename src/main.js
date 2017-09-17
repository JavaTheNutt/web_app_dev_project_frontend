// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueMaterial from 'vue-material';
import VeeValidate from 'vee-validate';
import VueResource from 'vue-resource';
import * as VueGoogleMaps from 'vue2-google-maps';
import 'vue-material/dist/vue-material.css'

import {App} from './app'
import router from './router'
import store from './store';
import privateConfig from '../config/private';
import firebase from 'firebase';
import * as log from 'loglevel';

require('../node_modules/vue-material/dist/vue-material.css');
if(process.env.NODE_ENV === 'production'){
  log.setLevel('silent');
}else{
  log.setLevel('trace');
}

firebase.initializeApp(privateConfig.firebase);

Vue.config.productionTip = false;
Vue.use(VueMaterial);
Vue.use(VeeValidate);
Vue.use(VueGoogleMaps, {
  load: {
    key: privateConfig.mapsApiKey
  }
});
Vue.use(VueResource);
Vue.material.registerTheme('default', {
  primary: 'blue-grey',
  accent: 'red'
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
});
