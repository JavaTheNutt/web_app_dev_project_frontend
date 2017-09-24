<template>
  <div>
    <md-toolbar>
      <md-button class="md-icon-button" @click="toggleLeftSidenav">
        <md-icon>menu</md-icon>
      </md-button>
      <h2 class="md-title" style="flex:1">Home Resource Planner</h2>
      <!--<md-button class="md-raised md-accent" @click.native="goLogin" v-if="!loggedIn">Login</md-button>-->
    </md-toolbar>
    <md-card></md-card>
    <md-sidenav class="md-left" ref="leftSidenav" @open="open('Left')" @close="close('Left')">
      <md-toolbar class="md-small">
        <div class="md-toolbar-container">
          <h3 class="md-subtitle">Navigation</h3>
        </div>
      </md-toolbar>
      <md-list>
        <md-list-item @click.native="$refs.leftSidenav.close();redirect('/')" class="side-nav--list-item">
          <p class="side-nav--link">Home</p>
        </md-list-item>
        <md-list-item @click.native="$refs.leftSidenav.close();redirect('/signup')" v-if="!loggedIn">
          <p class="side-nav--link">Signup</p>
        </md-list-item>
        <md-list-item @click.native="$refs.leftSidenav.close();redirect('/add_address')" v-if="loggedIn">
          <p class="side-nav--link">Add Address</p>
        </md-list-item>
        <md-list-item @click.native="$refs.leftSidenav.close();triggerLogOut()" v-if="loggedIn">
          <p class="side-nav--link">Logout</p>
        </md-list-item>
      </md-list>
    </md-sidenav>
  </div>
</template>
<script>
  import * as Logger from 'loglevel';
  //import {createNamespacedHelpers} from 'vuex';
  import {mapGetters} from 'vuex';
  import authTypes from '@/app/store/auth/types';
  //fixme need to fix link styling in side nav bar
  export default {
    name: 'navigation',
    computed: {
      ...mapGetters({
        loggedIn: authTypes.getters.loggedIn
      })
    },
    methods: {
      toggleLeftSidenav() {
        this.$refs.leftSidenav.toggle();
      },
      open(ref) {
        Logger.info(`Opened: ${ref}`);
      },
      close(ref) {
        Logger.info(`Closed: ${ref}`);
      },
      redirect(ref) {
        Logger.info(`redirecting to ${ref}`);
        this.$router.push(ref);
      },
      goLogin() {
        this.$router.push('/login')
      },
      triggerLogOut() {
        Logger.info(`log out ui triggered, dispatching logout event`);
        this.$store.dispatch(authTypes.actions.a_logOutUser);
        this.$router.push('/')
      }
    }
  }
</script>
<style scoped lang="scss">
  .side-nav--link {
    cursor: default;
  }

  .side-nav--list-item {
    cursor: pointer;
  }
</style>
