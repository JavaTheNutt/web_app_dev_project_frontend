// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueMaterial from 'vue-material';
import VeeValidate from 'vee-validate';
import * as VueGoogleMaps from 'vue2-google-maps';
import {sync} from 'vuex-router-sync';
import 'vue-material/dist/vue-material.css'

import {App} from './app'
import store from './store';
import router from './router'
import privateConfig from '../config/private';
import firebase from 'firebase';
import * as log from 'loglevel';
import axios from 'axios';
import * as Logger from 'loglevel';
require('../node_modules/vue-material/dist/vue-material.css');
if (process.env.NODE_ENV === 'production') {
  log.setLevel('silent');
} else {
  log.setLevel('trace');
}
/*const unsync =*/
sync(store, router, {moduleName: 'router_store'}); //set up syncing, store callback for teardown if nessecary
firebase.initializeApp(privateConfig.firebase);

Vue.config.productionTip = false;
Vue.use(VueMaterial);
Vue.use(VeeValidate);
Vue.use(VueGoogleMaps, {
  load: {
    key: privateConfig.mapsApiKey
  }
});
//Vue.use(VueResource);
Vue.prototype.$http = axios; //switch to axios since vue-resource is no longer the recommended http client
Vue.material.registerTheme({
  'default': {
    primary: 'blue',
    accent: 'pink',
    warn: 'red',
    backgroud: 'grey'
  },
  'secondary': {
    primary: 'indigo',
    accent: 'green',
    warn: 'orange'
  }
});
router.beforeEach((to, from, next)=>{
  if(store.state.auth.loggedIn){
    Logger.info(`user logged in`);
    return next();
  }
  Logger.info(`user not logged in`);
  return next();
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: {App}
});
