<template>
  <div id="app">
    <div class="phone-viewport">
      <md-toolbar>
        <md-button class="md-icon-button" @click="toggleLeftSidenav">
          <md-icon>menu</md-icon>
        </md-button>
        <h2 class="md-title">Home Resource Planner</h2>
      </md-toolbar>
      <md-toolbar class="md-dense internet-status-box" v-if="noConnection">
        <h2 class="md-subtitle">You are not connected to the internet</h2>
      </md-toolbar>
      <md-card></md-card>
      <md-sidenav class="md-left" ref="leftSidenav" @open="open('Left')" @close="close('Left')">
        <md-toolbar class="md-small">
          <div class="md-toolbar-container">
            <h3 class="md-subtitle">Navigation</h3>
          </div>
        </md-toolbar>
        <md-list>
          <md-list-item>
            <router-link exact to="/" class="sideNavListItem" @click.native="$refs.leftSidenav.close()">Home
            </router-link>
          </md-list-item>
          <md-list-item>
            <router-link exact to="/login" class="sideNavListItem" @click.native="$refs.leftSidenav.close()">Login
            </router-link>
          </md-list-item>
        </md-list>
      </md-sidenav>
    </div>
    <main>
      <router-view></router-view>
    </main>
    <md-snackbar  ref="snackbar">
      <span>{{snackMsg}}</span>
      <md-button class="md-accent" @click="$refs.snackbar.close()">Close</md-button>
    </md-snackbar>
  </div>
</template>

<script>
  import MdToolbar from '../../node_modules/vue-material/src/components/mdToolbar/mdToolbar.vue';
  import MdButton from '../../node_modules/vue-material/src/components/mdButton/mdButton.vue';
  import MdIcon from '../../node_modules/vue-material/src/components/mdIcon/mdIcon.vue';
  import MdSidenav from '../../node_modules/vue-material/src/components/mdSidenav/mdSidenav.vue';
  import MdList from '../../node_modules/vue-material/src/components/mdList/mdList.vue';
  import MdListItem from '../../node_modules/vue-material/src/components/mdList/mdListItemButton.vue';
  import bus from './services/bus';
  import MdSnackbar from '../../node_modules/vue-material/src/components/mdSnackbar/mdSnackbar.vue';
  import * as Logger from 'loglevel';
  import MdCard from '../../node_modules/vue-material/src/components/mdCard/mdCard.vue';



  export default {
    components: {
      MdCard,
      MdSnackbar,
      MdListItem,
      MdList,
      MdSidenav,
      MdIcon,
      MdButton,
      MdToolbar
    },
    name: 'app',
    methods: {
      toggleLeftSidenav() {
        this.$refs.leftSidenav.toggle();
      },
      open(ref) {
        Logger.info(`Opened: ${ref}`);
      },
      close(ref) {
        Logger.info(`Closed: ${ref}`);
      }
    },
    data(){
      return {
        snackMsg: '',
        noConnection: false
      }
    },
    created(){
      bus.$on('showSnack', (message)=>{
        this.snackMsg = message;
        this.$refs.snackbar.open();
      })
    },
    mounted(){
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
    }
  }
</script>

<style lang="scss">
  @import url("https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic");
  @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
  @import "../styles/variables";

  body {
    margin: 0;
  }

  .internet-status-box{
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
