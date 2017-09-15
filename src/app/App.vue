<template>
  <div id="app">
    <div class="phone-viewport">
      <navigation></navigation>
    </div>
    <main>
      <router-view></router-view>
    </main>
    <md-snackbar ref="snackbar">
      <span>{{snackMsg}}</span>
      <md-button class="md-accent" @click="$refs.snackbar.close()">Close</md-button>
    </md-snackbar>
    <!--<md-snackbar ref="noConnectionMessage" :md-duration="Infinity" v-if="noConnection">
      <span>You are not connected to the internet. Some features may be unavailable</span>
      <md-button class="md-accent" @click="$refs.snackbar.close()">Close</md-button>
    </md-snackbar>-->
  </div>
</template>

<script>
  import MdButton from '../../node_modules/vue-material/src/components/mdButton/mdButton.vue';
  import bus from './services/bus';
  import * as Logger from 'loglevel';
  import {mapState} from 'vuex';
  import Navigation from './components/Nav';
  //import * as firebaseService from './services/firebase';

  export default {
    components: {
      Navigation
    },
    name: 'app',
    methods: {

    },
    data() {
      return {
        snackMsg: '',
        noConnection: false,
        loginText: 'Login'
      }
    },
    created() {
      bus.$on('showSnack', (message) => {
        this.snackMsg = message;
        this.$refs.snackbar.open();
      })
    },
    mounted() {
      //todo listen for auth change events, to update the ui accordingly
      //this.$refs.noInternetMsg.open();
      Logger.info(`main app mounted`);
      this.noConnection = !navigator.onLine;
      window.addEventListener('online', function () {
        Logger.info(`online status changed to up`);
        this.noConnection = false;
      });
      window.addEventListener('offline', function () {
        Logger.info(`online status changed to down`);
        this.noConnection = true;
      });
      setTimeout(() =>{
        this.$store.dispatch('a_testCurrentAuthState');
      }, 50);
      /*process.nextTick(()=>{
        this.$store.dispatch('a_testCurrentAuthState');
      })*/
    }
  }
</script>

<style lang="scss">
  @import url("https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic");
  @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
  @import "../styles/variables";

  /*required to remove chrome yellow fill on autofilled fields
  found: https://github.com/angular/material/issues/2260*/
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px white inset;
  }

  body {
    margin: 0;
  }

  .internet-status-box {
    background-color: darkgray;
    color: black;
  }

  #app {
    font-family: 'Roboto', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    overflow-x: hidden;
  }

  .nav-spacer {
    flex: 1;
    width: 100%;
  }

  .sideNavListItem {
    z-index: 101;
  }

  main {
    text-align: center;
    //margin-top: 40px;
    margin: $pageMargin;
  }

  header {
    margin: 0;
    height: 56px;
    padding: 0 16px 0 24px;
    background-color: #35495E;
    color: #ffffff;
  }

  header span {
    display: block;
    position: relative;
    font-size: 20px;
    line-height: 1;
    letter-spacing: .02em;
    font-weight: 400;
    box-sizing: border-box;
    padding-top: 16px;
  }
</style>
